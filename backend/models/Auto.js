const mongoose = require('mongoose');

const autoSchema = new mongoose.Schema({
  auto_id: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  number: { type: String, required: true },
  type: { type: String, enum: ['EV', 'CNG', 'Fuel'], required: true },
  purchase_date: { type: Date, required: true },
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  image_url: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Auto', autoSchema);
