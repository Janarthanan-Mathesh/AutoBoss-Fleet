const Auto = require('../models/Auto');
const Driver = require('../models/Driver');
const Rental = require('../models/Rental');
const Payment = require('../models/Payment');
const Maintenance = require('../models/Maintenance');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalAutos = await Auto.countDocuments();
    const totalDrivers = await Driver.countDocuments();
    const activeRentals = await Rental.countDocuments({ status: 'active' });
    const completedRentals = await Rental.countDocuments({ status: 'completed' });

    // Monthly income
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const monthlyIncome = await Payment.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lt: new Date(currentYear, currentMonth, 1)
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount_paid' } } }
    ]);
    const income = monthlyIncome.length > 0 ? monthlyIncome[0].total : 0;

    // Monthly expenses (maintenance)
    const monthlyExpenses = await Maintenance.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lt: new Date(currentYear, currentMonth, 1)
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$cost' } } }
    ]);
    const expenses = monthlyExpenses.length > 0 ? monthlyExpenses[0].total : 0;

    const profit = income - expenses;

    res.json({
      totalAutos,
      totalDrivers,
      activeRentals,
      completedRentals,
      monthlyIncome: income,
      monthlyExpenses: expenses,
      profit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getIncomeExpenseChart = async (req, res) => {
  try {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
        start: new Date(date.getFullYear(), date.getMonth(), 1),
        end: new Date(date.getFullYear(), date.getMonth() + 1, 1)
      });
    }

    const chartData = await Promise.all(months.map(async (m) => {
      const income = await Payment.aggregate([
        { $match: { date: { $gte: m.start, $lt: m.end } } },
        { $group: { _id: null, total: { $sum: '$amount_paid' } } }
      ]);
      const expense = await Maintenance.aggregate([
        { $match: { date: { $gte: m.start, $lt: m.end } } },
        { $group: { _id: null, total: { $sum: '$cost' } } }
      ]);
      return {
        month: m.month,
        income: income.length > 0 ? income[0].total : 0,
        expense: expense.length > 0 ? expense[0].total : 0
      };
    }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlyReports = async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    const reports = [];
    for (let month = 1; month <= 12; month++) {
      const start = new Date(targetYear, month - 1, 1);
      const end = new Date(targetYear, month, 1);

      const income = await Payment.aggregate([
        { $match: { date: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: '$amount_paid' } } }
      ]);
      const expense = await Maintenance.aggregate([
        { $match: { date: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: '$cost' } } }
      ]);

      reports.push({
        month: new Date(targetYear, month - 1).toLocaleString('default', { month: 'long' }),
        income: income.length > 0 ? income[0].total : 0,
        expense: expense.length > 0 ? expense[0].total : 0,
        profit: (income.length > 0 ? income[0].total : 0) - (expense.length > 0 ? expense[0].total : 0)
      });
    }

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
