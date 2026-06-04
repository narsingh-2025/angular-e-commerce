const express = require('express');
const router  = express.Router();
const Review  = require('../models/Review');
const Product = require('../models/Product');

// GET reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST new review
router.post('/', async (req, res) => {
  try {
    const review = await new Review(req.body).save();
    // Update product avgRating & reviewCount
    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats.length) {
      await Product.findByIdAndUpdate(review.product, {
        avgRating:   Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].count,
      });
    }
    res.status(201).json(review);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PATCH helpful count
router.patch('/:id/helpful', async (req, res) => {
  try {
    const r = await Review.findByIdAndUpdate(req.params.id, { $inc: { helpful: 1 } }, { new: true });
    res.json(r);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE review
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
