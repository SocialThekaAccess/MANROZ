/**
 * Shopify → Cloudinary Image Migration Script
 * 
 * What it does:
 * 1. Reads CSV and extracts all Shopify image URLs per product
 * 2. Uploads each image to Cloudinary (auto compressed)
 * 3. Generates a new products.js with Cloudinary URLs
 */

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// ── Cloudinary config ──────────────────────────────────────────────
cloudinary.config({
  cloud_name: 'oaaxsftf',
  api_key: '555729366893928',
  api_secret: '0PatV26DpmSn8i3H9MRUshqxJ9A',
});

// ── Paths ──────────────────────────────────────────────────────────
const CSV_PATH = path.join(__dirname, '../frontend/public/products_export_1 (3).csv');
const PRODUCTS_JS_PATH = path.join(__dirname, '../frontend/src/data/products.js');

// ── Parse CSV ─────────────────────────────────────────────────────
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);

  const handleIdx = headers.indexOf('Handle');
  const imageSrcIdx = headers.indexOf('Image Src');

  // Group image URLs by product handle
  const productImages = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = parseCSVLine(line);
    const handle = cols[handleIdx]?.trim();
    const imageSrc = cols[imageSrcIdx]?.trim();

    if (handle && imageSrc && imageSrc.startsWith('http')) {
      if (!productImages[handle]) productImages[handle] = [];
      if (!productImages[handle].includes(imageSrc)) {
        productImages[handle].push(imageSrc);
      }
    }
  }

  return productImages;
}

// Simple CSV line parser (handles quoted fields)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// ── Upload single image to Cloudinary ─────────────────────────────
async function uploadToCloudinary(url, handle, index) {
  try {
    const publicId = `manroz/products/${handle}/${handle}_${index + 1}`;
    
    const result = await cloudinary.uploader.upload(url, {
      public_id: publicId,
      overwrite: false,          // skip if already uploaded
      resource_type: 'image',
      quality: 'auto',           // auto compress
      fetch_format: 'auto',      // auto best format (WebP/AVIF)
      transformation: [
        { width: 800, crop: 'limit' }, // max width 800px
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    return result.secure_url;
  } catch (err) {
    console.error(`  ✗ Failed: ${url} — ${err.message}`);
    return url; // fallback to original Shopify URL
  }
}

// ── Main migration ─────────────────────────────────────────────────
async function migrate() {
  console.log('📦 Reading CSV...');
  const productImages = parseCSV(CSV_PATH);
  
  const handles = Object.keys(productImages);
  console.log(`✅ Found ${handles.length} products with images\n`);

  // Result map: handle → [cloudinary_url1, url2, ...]
  const cloudinaryMap = {};
  let totalImages = 0;
  let uploadedCount = 0;

  for (let i = 0; i < handles.length; i++) {
    const handle = handles[i];
    const images = productImages[handle];
    console.log(`[${i + 1}/${handles.length}] ${handle} (${images.length} images)`);

    cloudinaryMap[handle] = [];

    for (let j = 0; j < images.length; j++) {
      process.stdout.write(`  Uploading image ${j + 1}/${images.length}... `);
      const cloudUrl = await uploadToCloudinary(images[j], handle, j);
      cloudinaryMap[handle].push(cloudUrl);
      uploadedCount++;
      console.log(`✓`);
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 200));
    }

    totalImages += images.length;
  }

  console.log(`\n✅ Done! ${uploadedCount}/${totalImages} images uploaded\n`);

  // ── Save mapping JSON ────────────────────────────────────────────
  const mapPath = path.join(__dirname, 'cloudinary-map.json');
  fs.writeFileSync(mapPath, JSON.stringify(cloudinaryMap, null, 2));
  console.log(`📄 Saved mapping to: ${mapPath}`);

  // ── Update products.js ───────────────────────────────────────────
  console.log('\n🔄 Updating products.js...');
  
  let productsContent = fs.readFileSync(PRODUCTS_JS_PATH, 'utf8');
  let updatedCount = 0;

  for (const handle of handles) {
    const newUrls = cloudinaryMap[handle];
    if (!newUrls || newUrls.length === 0) continue;

    // Replace Shopify CDN URLs for this product with Cloudinary URLs
    // Find the images array for this handle and replace each URL
    const oldUrls = productImages[handle];
    for (let k = 0; k < oldUrls.length; k++) {
      if (newUrls[k] && oldUrls[k] !== newUrls[k]) {
        productsContent = productsContent.split(oldUrls[k]).join(newUrls[k]);
        updatedCount++;
      }
    }
  }

  fs.writeFileSync(PRODUCTS_JS_PATH, productsContent, 'utf8');
  console.log(`✅ Updated ${updatedCount} image URLs in products.js`);
  console.log('\n🎉 Migration complete! Shopify images → Cloudinary done.');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
