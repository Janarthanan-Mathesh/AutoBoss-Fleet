const Maintenance = require('../models/Maintenance');

exports.getMaintenances = async (req, res) => {
  try {
    const maintenances = await Maintenance.find();
    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);
    if (!maintenance) return res.status(404).json({ message: 'Maintenance not found' });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMaintenance = async (req, res) => {
  try {
    const { auto_id, date, description, cost } = req.body;
    const maintenance = new Maintenance({ auto_id, date, description, cost });
    await maintenance.save();
    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMaintenance = async (req, res) => {
  try {
    const { auto_id, date, description, cost } = req.body;
    const maintenance = await Maintenance.findByIdAndUpdate(req.params.id, { auto_id, date, description, cost }, { new: true });
    if (!maintenance) return res.status(404).json({ message: 'Maintenance not found' });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenance) return res.status(404).json({ message: 'Maintenance not found' });
    res.json({ message: 'Maintenance deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get total maintenance cost per auto
exports.getMaintenanceCostPerAuto = async (req, res) => {
  try {
    const costs = await Maintenance.aggregate([
      { $group: { _id: '$auto_id', totalCost: { $sum: '$cost' } } }
    ]);
    res.json(costs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get total maintenance cost per month
exports.getMaintenanceCostPerMonth = async (req, res) => {
  try {
    const costs = await Maintenance.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          totalCost: { $sum: '$cost' }
        }
      }
    ]);
    res.json(costs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
