const express = require('express');
const router = express.Router();
const BulkOrder = require('../models/BulkOrder');

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await BulkOrder.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await BulkOrder.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await BulkOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  const order = new BulkOrder(req.body);
  try {
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const updated = await BulkOrder.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, notes: req.body.notes },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await BulkOrder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
