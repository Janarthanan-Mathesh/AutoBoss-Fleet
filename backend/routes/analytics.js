const express = require('express');
const { getDashboardStats, getIncomeExpenseChart, getMonthlyReports } = require('../controllers/analytics');
const router = express.Router();

router.get('/dashboard', getDashboardStats);
router.get('/chart', getIncomeExpenseChart);
router.get('/reports', getMonthlyReports);

module.exports = router;
