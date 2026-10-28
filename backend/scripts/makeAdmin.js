/**
 * Creates (or updates) the fixed admin account:
 *   Email:    manrozadmin@gmail.com
 *   Password: Manroz2026
 *
 * Run once: node scripts/makeAdmin.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config({ path: 'C:/Users/acer/Documents/MANROZ/backend/.env' });

const ADMIN_EMAIL    = 'manrozadmin@gmail.com';
const ADMIN_PASSWORD = 'Manroz2026';
const ADMIN_NAME     = 'Manroz Admin';

await mongoose.connect(process.env.MONGO_URI);

const existing = await User.findOne({ email: ADMIN_EMAIL });

if (existing) {
  // Update role and reset password
  existing.role     = 'admin';
  existing.password = ADMIN_PASSWORD; // pre-save hook will hash it
  await existing.save();
  console.log(`✅ Admin account updated: ${ADMIN_EMAIL}`);
} else {
  // Create fresh admin account
  await User.create({
    name:     ADMIN_NAME,
    email:    ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role:     'admin',
  });
  console.log(`✅ Admin account created: ${ADMIN_EMAIL}`);
}

console.log('   Email:    manrozadmin@gmail.com');
console.log('   Password: Manroz2026');
console.log('   URL:      /admin');

await mongoose.disconnect();
process.exit(0);
