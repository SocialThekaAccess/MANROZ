import Coupon from '../models/Coupon.js';

// ── Admin CRUD ────────────────────────────────────────────────────────────────

// @desc  Get all coupons
// @route GET /api/admin/coupons
// @access Admin
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Create coupon
// @route POST /api/admin/coupons
// @access Admin
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Coupon code already exists.' });
    }
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update coupon
// @route PUT /api/admin/coupons/:id
// @access Admin
export const updateCoupon = async (req, res) => {
  try {
    // Force code uppercase on update
    if (req.body.code) req.body.code = req.body.code.toUpperCase().trim();
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Coupon code already exists.' });
    }
    res.status(500).json({ message: err.message });
  }
};

// @desc  Delete coupon
// @route DELETE /api/admin/coupons/:id
// @access Admin
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Public — validate & apply ─────────────────────────────────────────────────

// @desc  Validate a coupon code against a cart total
// @route POST /api/coupons/validate
// @access Public (requires auth via JWT so we know who's using it)
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required.' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code.' });
    if (!coupon.isActive) return res.status(400).json({ message: 'This coupon is no longer active.' });
    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).json({ message: 'This coupon has expired.' });
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'This coupon has reached its usage limit.' });
    }
    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon.`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((cartTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      // flat
      discount = Math.min(coupon.discountValue, cartTotal);
    }

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,          // actual rupee amount to deduct
      description: coupon.description,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
