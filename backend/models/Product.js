const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  description:   { type: String, trim: true },
  price:         { type: Number, required: true, min: 0 },
  category:      { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory:   { type: String, trim: true },
  brand:         { type: String, trim: true },
  unit:          { type: String, default: 'piece' },
  stock:         { type: Number, default: 0, min: 0 },
  minOrderQty:   { type: Number, default: 1 },
  bulkPricing:   [{ minQty: Number, price: Number }],
  tags:          [String],
  isActive:      { type: Boolean, default: true },
  isFeatured:    { type: Boolean, default: false },
  farmer:        { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
  isOrganic:     { type: Boolean, default: false },
  farmLocation:  { type: String },
  harvestSeason: { type: String },
  avgRating:     { type: Number, default: 0 },
  reviewCount:   { type: Number, default: 0 },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
