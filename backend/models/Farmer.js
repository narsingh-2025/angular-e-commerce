const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  farmName:       { type: String, required: true },
  phone:          { type: String, required: true },
  email:          { type: String },
  location:       { type: String, required: true },
  state:          { type: String },
  description:    { type: String },
  coverColor:     { type: String, default: '#10b981' },
  specialities:   [String],
  certifications: [String],
  isOrganic:      { type: Boolean, default: false },
  isVerified:     { type: Boolean, default: false },
  yearsActive:    { type: Number, default: 1 },
  isActive:       { type: Boolean, default: true },
  rating:         { type: Number, default: 0 },
  totalSales:     { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Farmer', farmerSchema);
