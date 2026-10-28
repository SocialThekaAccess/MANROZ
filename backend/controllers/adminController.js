import Order from '../models/Order.js';
import User from '../models/User.js';
import Announcement from '../models/Announcement.js';
import SaleBanner from '../models/SaleBanner.js';

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalOrders,
      totalUsers,
      paidOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      recentOrders,
      revenueAgg,
      monthlyRevenueAgg,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments({ paymentStatus: 'paid' }),
      Order.countDocuments({ paymentStatus: 'pending' }),
      Order.countDocuments({ orderStatus: 'processing' }),
      Order.countDocuments({ orderStatus: 'shipped' }),
      Order.countDocuments({ orderStatus: 'delivered' }),
      Order.countDocuments({ orderStatus: 'cancelled' }),
      Order.find({ paymentStatus: 'paid' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email'),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            revenue: { $sum: '$totalAmount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      totalOrders,
      totalUsers,
      totalRevenue,
      paidOrders,
      pendingOrders,
      orderStatus: {
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      recentOrders,
      monthlyRevenue: monthlyRevenueAgg,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── ORDERS ───────────────────────────────────────────────────────────────────

// @desc    Get all orders (paginated)
// @route   GET /api/admin/orders?page=1&limit=20&status=&payment=
// @access  Admin
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.orderStatus = req.query.status;
    if (req.query.payment) filter.paymentStatus = req.query.payment;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email'),
      Order.countDocuments(filter),
    ]);

    res.json({
      orders,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/admin/orders/:id
// @access  Admin
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Razorpay payment details for an order
// @route   GET /api/admin/orders/:id/razorpay-payment
// @access  Admin
export const getRazorpayPaymentDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.razorpayPaymentId) return res.status(404).json({ message: 'No payment found for this order' });

    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const payment = await razorpay.payments.fetch(order.razorpayPaymentId);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users?page=1&limit=20
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({}).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    // Attach order count per user
    const userIds = users.map((u) => u._id);
    const orderCounts = await Order.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: '$user', count: { $sum: 1 }, spent: { $sum: '$totalAmount' } } },
    ]);
    const countMap = {};
    orderCounts.forEach((o) => {
      countMap[o._id.toString()] = { count: o.count, spent: o.spent };
    });

    const enriched = users.map((u) => ({
      ...u.toObject(),
      orderCount: countMap[u._id.toString()]?.count || 0,
      totalSpent: countMap[u._id.toString()]?.spent || 0,
    }));

    res.json({ users: enriched, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin accounts' });
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────

// @desc    Get all announcements
// @route   GET /api/admin/announcements
// @access  Admin
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ priority: -1, createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active announcements (public — used by TopMarquee & bottom marquee)
// @route   GET /api/admin/announcements/active?position=top|bottom|both
// @access  Public
export const getActiveAnnouncements = async (req, res) => {
  try {
    const { position } = req.query;
    const query = { isActive: true };
    // If a position is requested, return announcements for that position OR 'both'
    if (position && ['top', 'bottom'].includes(position)) {
      query.position = { $in: [position, 'both'] };
    }
    const announcements = await Announcement.find(query).sort({ priority: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create announcement
// @route   POST /api/admin/announcements
// @access  Admin
export const createAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.create(req.body);
    res.status(201).json(ann);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update announcement
// @route   PUT /api/admin/announcements/:id
// @access  Admin
export const updateAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ann) return res.status(404).json({ message: 'Announcement not found' });
    res.json(ann);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/admin/announcements/:id
// @access  Admin
export const deleteAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.findByIdAndDelete(req.params.id);
    if (!ann) return res.status(404).json({ message: 'Announcement not found' });
    res.json({ message: 'Announcement removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── SALE BANNERS ─────────────────────────────────────────────────────────────

// @desc    Get all sale banners
// @route   GET /api/admin/sales
// @access  Admin
export const getSaleBanners = async (req, res) => {
  try {
    const banners = await SaleBanner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active sale banner (public — used by frontend)
// @route   GET /api/admin/sales/active
// @access  Public
export const getActiveSaleBanner = async (req, res) => {
  try {
    const now = new Date();
    const banner = await SaleBanner.findOne({
      isActive: true,
      $or: [
        { startDate: { $exists: false }, endDate: { $exists: false } },
        { startDate: { $lte: now }, endDate: { $gte: now } },
        { startDate: { $lte: now }, endDate: { $exists: false } },
      ],
    });
    res.json(banner || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create sale banner
// @route   POST /api/admin/sales
// @access  Admin
export const createSaleBanner = async (req, res) => {
  try {
    const banner = await SaleBanner.create(req.body);
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update sale banner
// @route   PUT /api/admin/sales/:id
// @access  Admin
export const updateSaleBanner = async (req, res) => {
  try {
    const banner = await SaleBanner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ message: 'Sale banner not found' });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete sale banner
// @route   DELETE /api/admin/sales/:id
// @access  Admin
export const deleteSaleBanner = async (req, res) => {
  try {
    const banner = await SaleBanner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Sale banner not found' });
    res.json({ message: 'Sale banner removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
