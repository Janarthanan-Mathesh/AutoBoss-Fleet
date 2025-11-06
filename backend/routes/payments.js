const express = require('express');
const { getPayments, getPayment, createPayment, updatePayment, deletePayment, getPaymentSummary } = require('../controllers/payments');
const router = express.Router();

router.get('/', getPayments);
router.get('/:id', getPayment);
router.post('/', createPayment);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);
router.get('/summary/:rentalId', getPaymentSummary);

module.exports = router;
