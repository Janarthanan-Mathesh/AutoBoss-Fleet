const express = require('express');
const { getDrivers, getDriver, createDriver, updateDriver, deleteDriver } = require('../controllers/drivers');
const router = express.Router();

router.get('/', getDrivers);
router.get('/:id', getDriver);
router.post('/', createDriver);
router.put('/:id', updateDriver);
router.delete('/:id', deleteDriver);

module.exports = router;
