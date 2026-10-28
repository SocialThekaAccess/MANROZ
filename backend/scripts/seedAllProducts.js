/**
 * Seeds ALL products from frontend/src/data/products.js into MongoDB.
 * Safe to re-run — upserts on handle, won't create duplicates.
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config({ path: 'C:/Users/acer/Documents/MANROZ/backend/.env' });

// ── Read and parse the frontend products.js as text ───────────────────────────
const filePath = 'C:/Users/acer/Documents/MANROZ/frontend/src/data/products.js';
const raw = readFileSync(filePath, 'utf-8');

// Extract just the array literal between the first [ and the last ]
const start = raw.indexOf('[');
const end   = raw.lastIndexOf(']');
const arrayText = raw.slice(start, end + 1);

const products = eval(`(${arrayText})`);
console.log(`📦 Found ${products.length} products in products.js`);

// ── Connect + seed ────────────────────────────────────────────────────────────
await mongoose.connect(process.env.MONGO_URI);
console.log('✅ MongoDB connected');

// Build Product schema inline (mirrors models/Product.js)
const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  inventory: { type: Number, default: 0 },
  image: { type: String },
});

const productSchema = new mongoose.Schema(
  {
    handle: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    vendor: { type: String, default: 'Manroz' },
    type: { type: String },
    tags: [{ type: String }],
    category: { type: String },
    images: [{ type: String }],
    variants: [variantSchema],
    basePrice: { type: Number, required: true },
    compareAtPrice: { type: Number },
    status: { type: String, enum: ['active', 'draft', 'archived', 'soldout'], default: 'active' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Use existing model if already registered (avoids OverwriteModelError)
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

let inserted = 0;
let skipped  = 0;
let errors   = 0;

for (const p of products) {
  // Normalize status: 'soldout' is not in the original enum — map to 'active' with 0 inventory
  const status = ['active', 'draft', 'archived'].includes(p.status) ? p.status : 'active';

  try {
    const existing = await Product.findOne({ handle: p.handle });
    if (existing) {
      skipped++;
      continue;
    }

    await Product.create({
      handle:         p.handle,
      title:          p.title,
      description:    p.description || '',
      type:           p.type || '',
      category:       p.category || '',
      images:         p.images || [],
      variants:       (p.variants || []).map(v => ({
        size:           v.size,
        price:          v.price,
        compareAtPrice: v.compareAtPrice,
        inventory:      v.inventory ?? 0,
      })),
      basePrice:      p.basePrice,
      compareAtPrice: p.compareAtPrice,
      status,
      featured:       p.featured || false,
    });
    inserted++;
    process.stdout.write(`\r  ✓ ${inserted + skipped}/${products.length} — ${p.title.slice(0, 50)}`);
  } catch (e) {
    errors++;
    console.error(`\n  ✗ Error on ${p.handle}: ${e.message}`);
  }
}

console.log(`\n\n✅ Done!`);
console.log(`   Inserted: ${inserted}`);
console.log(`   Skipped (already existed): ${skipped}`);
console.log(`   Errors: ${errors}`);
console.log(`   Total in DB now: ${await Product.countDocuments()}`);

await mongoose.disconnect();
process.exit(0);
