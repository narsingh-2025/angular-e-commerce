const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   { type: String, required: true },
  company: { type: String },
  category: { type: String },
  items: [{
    productName: String,
    quantity:    Number,
    unit:        String,
  }],
  message:   { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'quoted', 'completed', 'cancelled'],
    default: 'pending',
  },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);
