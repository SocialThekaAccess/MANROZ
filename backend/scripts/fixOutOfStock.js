/**
 * Fixes products whose ALL variants have inventory=0 — marks them soldout.
 * Also checks original products.js to honor the original status.
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import Product from '../models/Product.js';

dotenv.config({ path: 'C:/Users/acer/Documents/MANROZ/backend/.env' });
await mongoose.connect(process.env.MONGO_URI);

// Parse original products.js to get intended status per handle
const raw = readFileSync('C:/Users/acer/Documents/MANROZ/frontend/src/data/products.js', 'utf-8');
const start = raw.indexOf('[');
const end   = raw.lastIndexOf(']');
const originalProducts = eval(`(${raw.slice(start, end + 1)})`);

const statusMap = {};
originalProducts.forEach(p => { statusMap[p.handle] = p.status; });

const all = await Product.find({});
let fixed = 0;

for (const p of all) {
  const allZero   = p.variants.every(v => v.inventory === 0);
  const origStatus = statusMap[p.handle] || 'active';
  
  // If original was soldout OR all variants are 0 inventory → mark soldout
  const shouldBeSoldout = origStatus === 'soldout' || allZero;
  
  if (shouldBeSoldout && p.status !== 'soldout') {
    await Product.findByIdAndUpdate(p._id, { status: 'soldout' });
    console.log(`  ✓ Fixed → soldout: ${p.handle}`);
    fixed++;
  }
}

console.log(`\n✅ Fixed ${fixed} products to soldout status.`);
const soldoutCount = await Product.countDocuments({ status: 'soldout' });
const activeCount  = await Product.countDocuments({ status: 'active' });
console.log(`   Active: ${activeCount} | Soldout: ${soldoutCount}`);

await mongoose.disconnect();
process.exit(0);
