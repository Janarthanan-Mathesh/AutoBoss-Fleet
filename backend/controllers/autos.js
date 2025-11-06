const Auto = require('../models/Auto');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getAutos = async (req, res) => {
  try {
    const autos = await Auto.find();
    res.json(autos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAuto = async (req, res) => {
  try {
    const auto = await Auto.findOne({ auto_id: req.params.id });
    if (!auto) return res.status(404).json({ message: 'Auto not found' });
    res.json(auto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAuto = async (req, res) => {
  try {
    const { auto_id, model, number, type, purchase_date, status } = req.body;
    let image_url = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image_url = result.secure_url;
    }
    const auto = new Auto({ auto_id, model, number, type, purchase_date, status, image_url });
    await auto.save();
    res.status(201).json(auto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAuto = async (req, res) => {
  try {
    const { auto_id, model, number, type, purchase_date, status } = req.body;
    let image_url = req.body.image_url;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image_url = result.secure_url;
    }
    const auto = await Auto.findOneAndUpdate({ auto_id: req.params.id }, { auto_id, model, number, type, purchase_date, status, image_url }, { new: true });
    if (!auto) return res.status(404).json({ message: 'Auto not found' });
    res.json(auto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAuto = async (req, res) => {
  try {
    const auto = await Auto.findOneAndDelete({ auto_id: req.params.id });
    if (!auto) return res.status(404).json({ message: 'Auto not found' });
    res.json({ message: 'Auto deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
