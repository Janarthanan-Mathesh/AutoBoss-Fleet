const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  rental_id: { type: String, required: true, unique: true },
  driver_id: { type: String, ref: 'Driver', required: true },
  auto_id: { type: String, ref: 'Auto', required: true },
  rent_type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  rent_amount: { type: Number, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date },
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);
