import axios from 'axios';
import Order from '../models/Order.js';

const SHIPROCKET_API = 'https://apiv2.shiprocket.in/v1/external';

// Get Shiprocket token (valid for 24 hours)
let shiprocketToken = null;
let tokenExpiry = null;

const getShiprocketToken = async () => {
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  const res = await axios.post(`${SHIPROCKET_API}/auth/login`, {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });

  shiprocketToken = res.data.token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23 hours
  return shiprocketToken;
};

// @desc    Create Shiprocket order after payment
// @route   POST /api/shiprocket/create-order
// @access  Private
export const createShiprocketOrder = async (req, res) => {
  try {
    const { dbOrderId } = req.body;

    const order = await Order.findById(dbOrderId).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.paymentStatus !== 'paid') return res.status(400).json({ message: 'Payment not completed' });

    const token = await getShiprocketToken();

    const orderData = {
      order_id: order._id.toString(),
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: 'Primary',
      channel_id: '',
      comment: 'Manroz Order',
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
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: order.totalAmount,
      length: 30,
      breadth: 25,
      height: 10,
      weight: 0.5,
    };

    const shipRes = await axios.post(`${SHIPROCKET_API}/orders/create/adhoc`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Save shiprocket order id
    await Order.findByIdAndUpdate(dbOrderId, {
      shiprocketOrderId: shipRes.data.order_id,
      shiprocketShipmentId: shipRes.data.shipment_id,
    });

    res.json({
      success: true,
      shiprocketOrderId: shipRes.data.order_id,
      shipmentId: shipRes.data.shipment_id,
    });
  } catch (error) {
    console.error('Shiprocket error:', error.response?.data || error.message);
    res.status(500).json({ message: error.response?.data?.message || error.message });
  }
};

// @desc    Get tracking info
// @route   GET /api/shiprocket/track/:shipmentId
// @access  Private
export const trackOrder = async (req, res) => {
  try {
    const token = await getShiprocketToken();
    const { shipmentId } = req.params;

    const trackRes = await axios.get(`${SHIPROCKET_API}/courier/track/shipment/${shipmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.json(trackRes.data);
  } catch (error) {
    res.status(500).json({ message: error.response?.data?.message || error.message });
  }
};
