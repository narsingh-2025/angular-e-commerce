const express = require('express');
const router = express.Router();
const Product   = require('../models/Product');
const Category  = require('../models/Category');
const BulkOrder = require('../models/BulkOrder');

router.get('/stats', async (req, res) => {
  try {
    const [totalProducts, totalCategories, totalInquiries, pendingInquiries, recentInquiries] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      BulkOrder.countDocuments(),
      BulkOrder.countDocuments({ status: 'pending' }),
      BulkOrder.find().sort({ createdAt: -1 }).limit(5),
    ]);
    res.json({ totalProducts, totalCategories, totalInquiries, pendingInquiries, recentInquiries });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
