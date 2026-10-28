import mongoose from 'mongoose';

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

const Product = mongoose.model('Product', productSchema);

export default Product;
