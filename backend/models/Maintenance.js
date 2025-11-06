const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  auto_id: { type: String, ref: 'Auto', required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
