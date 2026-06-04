const express   = require('express');
const router    = express.Router();
const Product   = require('../models/Product');
const Category  = require('../models/Category');
const BulkOrder = require('../models/BulkOrder');
const Order     = require('../models/Order');
const Farmer    = require('../models/Farmer');

router.get('/stats', async (req, res) => {
  try {
    const [totalProducts, totalCategories, totalInquiries, pendingInquiries,
           totalOrders, totalFarmers, recentInquiries, recentOrders] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      BulkOrder.countDocuments(),
      BulkOrder.countDocuments({ status: 'pending' }),
      Order.countDocuments(),
      Farmer.countDocuments({ isActive: true }),
      BulkOrder.find().sort({ createdAt: -1 }).limit(5),
      Order.find().sort({ createdAt: -1 }).limit(5),
    ]);
    const revenueResult = await Order.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    res.json({ totalProducts, totalCategories, totalInquiries, pendingInquiries, totalOrders, totalFarmers, totalRevenue, recentInquiries, recentOrders });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
