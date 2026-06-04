const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const { category, subcategory, featured, search, limit, page } = req.query;
    const filter = { isActive: true };
    if (category)    filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (featured)    filter.isFeatured = true;
    if (search)      filter.$text = { $search: search };

    const perPage = parseInt(limit) || 20;
    const skip    = (parseInt(page) - 1 || 0) * perPage;

    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug icon color').sort({ createdAt: -1 }).skip(skip).limit(perPage),
      Product.countDocuments(filter),
    ]);
    res.json({ products, total, page: parseInt(page) || 1, pages: Math.ceil(total / perPage) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/all', async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name slug').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug icon color');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  const product = new Product(req.body);
  try {
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
