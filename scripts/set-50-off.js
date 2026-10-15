/**
 * Set 50% off on all products
 * Sets compareAtPrice = basePrice * 2 for every product and variant
 */

const fs = require('fs');
const path = require('path');

const PRODUCTS_JS = path.join(__dirname, '../frontend/src/data/products.js');
let content = fs.readFileSync(PRODUCTS_JS, 'utf8');

// Replace all: compareAtPrice: <number> with compareAtPrice: basePrice*2
// Strategy: parse and rebuild using regex on each product block

// Match basePrice: XXXX and compareAtPrice: YYYY pairs
// Replace compareAtPrice with basePrice * 2

let count = 0;

// Replace variant compareAtPrice
content = content.replace(
  /(\{ size: '[^']+', price: (\d+), compareAtPrice: \d+, inventory: \d+ \})/g,
  (match, full, price) => {
    const newCompare = parseInt(price) * 2;
    count++;
    return full.replace(/compareAtPrice: \d+/, `compareAtPrice: ${newCompare}`);
  }
);

// Replace product-level compareAtPrice based on preceding basePrice
content = content.replace(
  /(basePrice: (\d+),\s*compareAtPrice: )\d+/g,
  (match, prefix, basePrice) => {
    const newCompare = parseInt(basePrice) * 2;
    count++;
    return `${prefix}${newCompare}`;
  }
);

fs.writeFileSync(PRODUCTS_JS, content, 'utf8');
console.log(`✅ Done! Updated ${count} compareAtPrice values to 50% off (basePrice × 2)`);
