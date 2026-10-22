import express from 'express';
import { createOrder, verifyPayment, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my', protect, getMyOrders);

export default router;
