const express = require('express');
const { getMaintenances, getMaintenance, createMaintenance, updateMaintenance, deleteMaintenance, getMaintenanceCostPerAuto, getMaintenanceCostPerMonth } = require('../controllers/maintenance');
const router = express.Router();

router.get('/', getMaintenances);
router.get('/:id', getMaintenance);
router.post('/', createMaintenance);
router.put('/:id', updateMaintenance);
router.delete('/:id', deleteMaintenance);
router.get('/cost/auto', getMaintenanceCostPerAuto);
router.get('/cost/month', getMaintenanceCostPerMonth);

module.exports = router;
