const express  = require('express');
const router   = express.Router();
const crypto   = require('crypto');
const Razorpay = require('razorpay');
const Order    = require('../models/Order');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post('/create-payment', async (req, res) => {
  try {
    const { total } = req.body;
    const options = {
      amount:   Math.round(total * 100), // paise
      currency: 'INR',
      receipt:  'FD' + Date.now(),
    };
    const rpOrder = await razorpay.orders.create(options);
    res.json({
      orderId: rpOrder.id,
      amount:  rpOrder.amount,
      currency: rpOrder.currency,
      keyId:   process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    // If Razorpay keys not set, allow COD fallback
    res.json({ orderId: null, amount: req.body.total * 100, currency: 'INR', keyId: null });
  }
});

// Verify payment & save order
router.post('/verify', async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderData } = req.body;
    let paymentStatus = 'paid';

    if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body).digest('hex');
      if (expected !== razorpaySignature) {
        return res.status(400).json({ message: 'Payment verification failed' });
      }
    } else {
      paymentStatus = 'pending'; // COD or test mode
    }

    const order = new Order({
      ...orderData,
      payment: {
        method:            'razorpay',
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        status:            paymentStatus,
        paidAt:            paymentStatus === 'paid' ? new Date() : undefined,
      },
      status: paymentStatus === 'paid' ? 'confirmed' : 'pending',
    });
    const saved = await order.save();
    res.json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET all orders (dashboard)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
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
