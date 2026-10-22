import express from 'express';
import { createShiprocketOrder, trackOrder } from '../controllers/shiprocketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createShiprocketOrder);
router.get('/track/:shipmentId', protect, trackOrder);

export default router;
