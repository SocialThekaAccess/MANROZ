import Razorpay from 'razorpay';
import crypto from 'crypto';
import axios from 'axios';
import Order from '../models/Order.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const SHIPROCKET_API = 'https://apiv2.shiprocket.in/v1/external';
let shiprocketToken = null;
let tokenExpiry = null;

const getShiprocketToken = async () => {
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) return shiprocketToken;
  const res = await axios.post(`${SHIPROCKET_API}/auth/login`, {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });
  shiprocketToken = res.data.token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
  return shiprocketToken;
};

// @desc    Create Razorpay order
// @route   POST /api/orders/create
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

    // Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // Save order in MongoDB with pending status
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending',
    });

    res.status(201).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: order._id,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update order in MongoDB
    const order = await Order.findByIdAndUpdate(
      dbOrderId,
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: 'paid',
      },
      { new: true }
    ).populate('user', 'name email');

    // Auto-create Shiprocket order
    try {
      const token = await getShiprocketToken();
      const orderData = {
        order_id: order._id.toString(),
        order_date: new Date().toISOString().split('T')[0],
        pickup_location: 'Primary',
        billing_customer_name: order.shippingAddress.fullName,
        billing_last_name: '',
        billing_address: order.shippingAddress.address,
        billing_city: order.shippingAddress.city,
        billing_pincode: order.shippingAddress.pincode,
        billing_state: order.shippingAddress.state,
        billing_country: 'India',
        billing_email: order.user.email,
        billing_phone: order.shippingAddress.phone,
        shipping_is_billing: true,
        order_items: order.items.map((item) => ({
          name: item.title,
          sku: item.productId,
          units: item.quantity,
          selling_price: item.price,
          discount: '',
          tax: '',
          hsn: '',
        })),
        payment_method: 'Prepaid',
        sub_total: order.totalAmount,
        length: 30,
        breadth: 25,
        height: 10,
        weight: 0.5,
      };

      const shipRes = await axios.post(`${SHIPROCKET_API}/orders/create/adhoc`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Order.findByIdAndUpdate(dbOrderId, {
        shiprocketOrderId: shipRes.data.order_id,
        shiprocketShipmentId: shipRes.data.shipment_id,
      });
      console.log('Shiprocket order created:', shipRes.data.order_id);
    } catch (shipErr) {
      console.error('Shiprocket auto-create failed:', shipErr.response?.data || shipErr.message);
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
