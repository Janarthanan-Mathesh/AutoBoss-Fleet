const express = require('express');
const { getRentals, getRental, createRental, updateRental, deleteRental } = require('../controllers/rentals');
const router = express.Router();

router.get('/', getRentals);
router.get('/:id', getRental);
router.post('/', createRental);
router.put('/:id', updateRental);
router.delete('/:id', deleteRental);

module.exports = router;
