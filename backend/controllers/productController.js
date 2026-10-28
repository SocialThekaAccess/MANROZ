import Product from '../models/Product.js';

// @desc  Get all products (public)
// @route GET /api/products
export const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status)   filter.status   = req.query.status;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// @desc  Get single product by handle (public)
// @route GET /api/products/:handle
export const getProductByHandle = async (req, res) => {
  try {
    const product = await Product.findOne({ handle: req.params.handle });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// @desc  Admin — get all products with full detail
// @route GET /api/admin/products
export const adminGetProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// @desc  Admin — update product (price, compareAtPrice, status, featured, variants)
// @route PUT /api/admin/products/:id
export const adminUpdateProduct = async (req, res) => {
  try {
    const allowed = ['basePrice', 'compareAtPrice', 'status', 'featured', 'variants', 'title', 'description'];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) { res.status(500).json({ message: e.message }); }
};
