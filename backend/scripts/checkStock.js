import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

dotenv.config({ path: 'C:/Users/acer/Documents/MANROZ/backend/.env' });
await mongoose.connect(process.env.MONGO_URI);

const all = await Product.find({}).select('handle status variants');

const outOfStock = all.filter(p => p.variants.every(v => v.inventory === 0));
const soldout    = all.filter(p => p.status === 'soldout');
const active     = all.filter(p => p.status === 'active');

console.log(`\nTotal products: ${all.length}`);
console.log(`Status = active:  ${active.length}`);
console.log(`Status = soldout: ${soldout.length}`);
console.log(`All variants inventory=0: ${outOfStock.length}`);

console.log('\nProducts with inventory=0 on ALL variants:');
outOfStock.forEach(p => {
  const sizes = p.variants.map(v => `${v.size}:${v.inventory}`).join(', ');
  console.log(`  [${p.status}] ${p.handle} | ${sizes}`);
});

await mongoose.disconnect();
process.exit(0);
