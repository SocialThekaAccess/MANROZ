/**
 * Fix remaining Shopify URLs that migration script missed
 */
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'oaaxsftf',
  api_key: '555729366893928',
  api_secret: '0PatV26DpmSn8i3H9MRUshqxJ9A',
});

const PRODUCTS_JS = path.join(__dirname, '../frontend/src/data/products.js');

// Remaining Shopify URLs with their product handles
const remaining = [
  { url: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/2_c7a4e85e-790e-4ecd-b9eb-cb7b1ac4310f.png?v=1746678488',   handle: 'heavy-black-pink-lehnga', idx: 99 },
  { url: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/11_48e64862-a50c-47c1-87a7-807f3018872e.png?v=1746678982',  handle: 'purple-coord-set-with-jacket', idx: 99 },
  { url: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/8_5c2d1a33-7b06-4167-81b9-3c398d0832fa.png?v=1746678841',   handle: 'hot-pink-festive-suit', idx: 99 },
  { url: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/23.png?v=1746679801',                                        handle: 'three-piece-pink-festive-coord-set', idx: 99 },
  { url: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/28.png?v=1746679977',                                        handle: 'pink-kaftaan-with-potli', idx: 99 },
  { url: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/029A0411.jpg?v=1746681350',                                  handle: 'pista-heavy-embroidery-coord-set', idx: 99 },
  { url: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/30-1.webp?v=1727105330',                                     handle: 'misc-product-1', idx: 99 },
  { url: 'https://cdn.shopify.com/s/files/1/0628/5937/8730/files/125.webp?v=1727105302',                                      handle: 'misc-product-2', idx: 99 },
];

async function fixRemaining() {
  let content = fs.readFileSync(PRODUCTS_JS, 'utf8');
  let fixedCount = 0;

  for (const item of remaining) {
    console.log(`Uploading: ${item.url.split('/').pop().split('?')[0]}`);
    try {
      const publicId = `manroz/products/${item.handle}/extra_${Date.now()}`;
      const result = await cloudinary.uploader.upload(item.url, {
        public_id: publicId,
        overwrite: false,
        resource_type: 'image',
        transformation: [{ width: 800, crop: 'limit' }, { quality: 'auto:good' }, { fetch_format: 'auto' }]
      });
      content = content.split(item.url).join(result.secure_url);
      console.log(`  ✓ → ${result.secure_url}`);
      fixedCount++;
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  fs.writeFileSync(PRODUCTS_JS, content, 'utf8');
  console.log(`\n✅ Fixed ${fixedCount} remaining URLs`);
}

fixRemaining().catch(console.error);
