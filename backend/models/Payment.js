const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  payment_id: { type: String, required: true, unique: true },
  rental_id: { type: String, ref: 'Rental', required: true },
  date: { type: Date, required: true },
  amount_paid: { type: Number, required: true },
  method: { type: String, enum: ['cash', 'online'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
