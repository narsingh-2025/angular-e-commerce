const express  = require('express');
const router   = express.Router();
const Order    = require('../models/Order');

// Try to load Razorpay only if keys are configured
let razorpay = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_REPLACE_ME') {
    const Razorpay = require('razorpay');
    razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (e) { /* razorpay not installed — COD mode */ }

router.post('/create-payment', async (req, res) => {
  try {
    if (razorpay) {
      const options = { amount: Math.round(req.body.total * 100), currency: 'INR', receipt: 'FD' + Date.now() };
      const rpOrder = await razorpay.orders.create(options);
      return res.json({ orderId: rpOrder.id, amount: rpOrder.amount, currency: rpOrder.currency, keyId: process.env.RAZORPAY_KEY_ID });
    }
    res.json({ orderId: null, amount: req.body.total * 100, currency: 'INR', keyId: null });
  } catch (err) {
    res.json({ orderId: null, amount: req.body.total * 100, currency: 'INR', keyId: null });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderData } = req.body;
    let paymentStatus = 'pending';

    if (razorpayOrderId && razorpayPaymentId && razorpaySignature && process.env.RAZORPAY_KEY_SECRET) {
      const crypto = require('crypto');
      const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpayOrderId + '|' + razorpayPaymentId).digest('hex');
      if (expected !== razorpaySignature) return res.status(400).json({ message: 'Payment verification failed' });
      paymentStatus = 'paid';
    }

    const order = new Order({
      ...orderData,
      payment: { method: 'razorpay', razorpayOrderId, razorpayPaymentId, razorpaySignature, status: paymentStatus, paidAt: paymentStatus === 'paid' ? new Date() : undefined },
      status: paymentStatus === 'paid' ? 'confirmed' : 'pending',
    });
    res.json(await order.save());
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/', async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    res.json(await Order.find(filter).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
