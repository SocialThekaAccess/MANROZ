import express from 'express';
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';
import {
  getDashboardStats,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getRazorpayPaymentDetails,
  getAllUsers,
  deleteUser,
  getAnnouncements,
  getActiveAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getSaleBanners,
  getActiveSaleBanner,
  createSaleBanner,
  updateSaleBanner,
  deleteSaleBanner,
} from '../controllers/adminController.js';
import { adminGetProducts, adminUpdateProduct } from '../controllers/productController.js';
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';

const router = express.Router();

// ── Public endpoints (used by frontend components) ───────────────────────────
router.get('/announcements/active', getActiveAnnouncements);
router.get('/sales/active', getActiveSaleBanner);

// ── Protected admin endpoints ─────────────────────────────────────────────────
router.use(protect, admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Orders
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.get('/orders/:id/razorpay-payment', getRazorpayPaymentDetails);
router.put('/orders/:id/status', updateOrderStatus);

// Users
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Announcements
router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

// Sale banners
router.get('/sales', getSaleBanners);
router.post('/sales', createSaleBanner);
router.put('/sales/:id', updateSaleBanner);
router.delete('/sales/:id', deleteSaleBanner);

// Products
router.get('/products', adminGetProducts);
router.put('/products/:id', adminUpdateProduct);

// Coupons
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

export default router;
