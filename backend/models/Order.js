const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    phone:   { type: String, required: true },
    address: { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    pincode: { type: String, required: true },
  },
  items: [{
    productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    price:       Number,
    quantity:    Number,
    unit:        String,
    subtotal:    Number,
  }],
  subtotal: { type: Number, required: true },
  tax:      { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total:    { type: Number, required: true },
  payment: {
    method:              { type: String, default: 'razorpay' },
    razorpayOrderId:     String,
    razorpayPaymentId:   String,
    razorpaySignature:   String,
    status:              { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paidAt:              Date,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  notes: String,
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'FD' + Date.now().toString().slice(-8);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
