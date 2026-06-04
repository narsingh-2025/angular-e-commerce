const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  email:    { type: String, required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  title:    { type: String },
  comment:  { type: String, required: true },
  verified: { type: Boolean, default: false },
  helpful:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
