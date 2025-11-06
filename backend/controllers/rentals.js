const Rental = require('../models/Rental');

exports.getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find();
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRental = async (req, res) => {
  try {
    const rental = await Rental.findOne({ rental_id: req.params.id });
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    res.json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRental = async (req, res) => {
  try {
    const { rental_id, driver_id, auto_id, rent_type, rent_amount, start_date, end_date, status } = req.body;
    const rental = new Rental({ rental_id, driver_id, auto_id, rent_type, rent_amount, start_date, end_date, status });
    await rental.save();
    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRental = async (req, res) => {
  try {
    const { rental_id, driver_id, auto_id, rent_type, rent_amount, start_date, end_date, status } = req.body;
    const rental = await Rental.findOneAndUpdate({ rental_id: req.params.id }, { rental_id, driver_id, auto_id, rent_type, rent_amount, start_date, end_date, status }, { new: true });
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    res.json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findOneAndDelete({ rental_id: req.params.id });
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    res.json({ message: 'Rental deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
