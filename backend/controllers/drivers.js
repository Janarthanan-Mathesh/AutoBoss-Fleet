const Driver = require('../models/Driver');

exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDriver = async (req, res) => {
  try {
    const driver = await Driver.findOne({ driver_id: req.params.id });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createDriver = async (req, res) => {
  try {
    const { driver_id, name, phone, license_no, address, assigned_auto } = req.body;
    const driver = new Driver({ driver_id, name, phone, license_no, address, assigned_auto });
    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const { driver_id, name, phone, license_no, address, assigned_auto } = req.body;
    const driver = await Driver.findOneAndUpdate({ driver_id: req.params.id }, { driver_id, name, phone, license_no, address, assigned_auto }, { new: true });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndDelete({ driver_id: req.params.id });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json({ message: 'Driver deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
