import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    description: { type: String, default: '' },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      default: 'percentage',
    },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },   // min cart total to apply
    maxDiscount: { type: Number, default: 0 },      // cap for percentage coupons (0 = no cap)
    usageLimit: { type: Number, default: 0 },       // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },        // null = never expires
  },
  { timestamps: true }
);

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
