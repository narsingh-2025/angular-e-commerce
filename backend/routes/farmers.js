const express = require('express');
const router  = express.Router();
const Farmer  = require('../models/Farmer');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const farmers = await Farmer.find({ isActive: true }).sort({ isVerified: -1, name: 1 });
    res.json(farmers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/all', async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 });
    res.json(farmers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    const products = await Product.find({ farmer: farmer._id, isActive: true }).populate('category', 'name icon color');
    res.json({ farmer, products });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const saved = await new Farmer(req.body).save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Farmer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Farmer not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Farmer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Farmer deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
