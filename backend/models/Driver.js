const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driver_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  license_no: { type: String, required: true },
  address: { type: String, required: true },
  assigned_auto: { type: String, ref: 'Auto' }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
