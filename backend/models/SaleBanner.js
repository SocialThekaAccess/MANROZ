import mongoose from 'mongoose';

const saleBannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    discountCode: { type: String, default: '' },
    discountPercent: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    bgColor: { type: String, default: '#8b1a2e' },
    textColor: { type: String, default: '#ffffff' },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

const SaleBanner = mongoose.model('SaleBanner', saleBannerSchema);
export default SaleBanner;
