const express = require('express');
const multer = require('multer');
const { getAutos, getAuto, createAuto, updateAuto, deleteAuto } = require('../controllers/autos');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.get('/', getAutos);
router.get('/:id', getAuto);
router.post('/', upload.single('image'), createAuto);
router.put('/:id', upload.single('image'), updateAuto);
router.delete('/:id', deleteAuto);

module.exports = router;
