const Payment = require('../models/Payment');
const Rental = require('../models/Rental');

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ payment_id: req.params.id });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { payment_id, rental_id, date, amount_paid, method } = req.body;
    const payment = new Payment({ payment_id, rental_id, date, amount_paid, method });
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { payment_id, rental_id, date, amount_paid, method } = req.body;
    const payment = await Payment.findOneAndUpdate({ payment_id: req.params.id }, { payment_id, rental_id, date, amount_paid, method }, { new: true });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete({ payment_id: req.params.id });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json({ message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate total paid, pending, overdue for a rental
exports.getPaymentSummary = async (req, res) => {
  try {
    const rental = await Rental.findOne({ rental_id: req.params.rentalId });
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    const payments = await Payment.find({ rental_id: req.params.rentalId });
    const totalPaid = payments.reduce((sum, p) => sum + p.amount_paid, 0);
    const pending = rental.rent_amount - totalPaid;
    const overdue = pending > 0 && new Date() > new Date(rental.end_date) ? pending : 0;
    res.json({ totalPaid, pending, overdue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
