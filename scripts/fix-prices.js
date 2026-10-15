/**
 * Fix prices:
 * - All Suits: basePrice = 3499, compareAtPrice = 6998
 * - All Coord Sets: basePrice = 4999, compareAtPrice = 9998
 */

const fs = require('fs');
const path = require('path');

const PRODUCTS_JS = path.join(__dirname, '../frontend/src/data/products.js');
let content = fs.readFileSync(PRODUCTS_JS, 'utf8');

// Parse products manually by splitting on product blocks
// Strategy: find category of each product and update prices accordingly

let suitCount = 0;
let coordCount = 0;

// Split into product objects and process each
// We'll use a line-by-line approach to track current category
const lines = content.split('\n');
let currentCategory = '';
const result = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  // Track current category
  if (line.includes("category: 'Suit'") || line.includes('category: "Suit"')) {
    currentCategory = 'Suit';
  } else if (line.includes("category: 'Coord Set'") || line.includes('category: "Coord Set"')) {
    currentCategory = 'Coord Set';
  } else if (line.includes("category: 'Lehenga'") || line.includes('category: "Lehenga"') || line.includes("category: 'Cotton'") || line.includes('category: "Cotton"')) {
    currentCategory = 'Other';
  } else if (line.includes("id:") && line.includes(',')) {
    // New product starts - reset category
    currentCategory = '';
  }

  // Update basePrice
  if (line.match(/^\s*basePrice:\s*\d+,/) ) {
    if (currentCategory === 'Suit') {
      line = line.replace(/basePrice:\s*\d+/, 'basePrice: 3499');
      suitCount++;
    } else if (currentCategory === 'Coord Set') {
      line = line.replace(/basePrice:\s*\d+/, 'basePrice: 4999');
      coordCount++;
    }
  }

  // Update compareAtPrice (product level)
  if (line.match(/^\s*compareAtPrice:\s*\d+,/) ) {
    if (currentCategory === 'Suit') {
      line = line.replace(/compareAtPrice:\s*\d+/, 'compareAtPrice: 6998');
    } else if (currentCategory === 'Coord Set') {
      line = line.replace(/compareAtPrice:\s*\d+/, 'compareAtPrice: 9998');
    }
  }

  // Update variant price and compareAtPrice
  if (line.match(/size:.*price:\s*\d+.*compareAtPrice:\s*\d+/)) {
    if (currentCategory === 'Suit') {
      line = line.replace(/price:\s*\d+/, 'price: 3499');
      line = line.replace(/compareAtPrice:\s*\d+/, 'compareAtPrice: 6998');
    } else if (currentCategory === 'Coord Set') {
      line = line.replace(/price:\s*\d+/, 'price: 4999');
      line = line.replace(/compareAtPrice:\s*\d+/, 'compareAtPrice: 9998');
    }
  }

  result.push(line);
}

const newContent = result.join('\n');
fs.writeFileSync(PRODUCTS_JS, newContent, 'utf8');
console.log(`✅ Suits updated: ${suitCount} products → ₹3,499 (was varied)`);
console.log(`✅ Coord Sets updated: ${coordCount} products → ₹4,999 (was varied)`);
