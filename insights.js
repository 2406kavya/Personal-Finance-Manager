// server/routes/insights.js

const express = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get monthly spending insights
router.get('/monthly', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });

    const monthlyInsights = {};
    transactions.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!monthlyInsights[month]) {
        monthlyInsights[month] = { income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        monthlyInsights[month].income += transaction.amount;
      } else {
        monthlyInsights[month].expense += transaction.amount;
      }
    });

    res.json(monthlyInsights);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get annual spending insights
router.get('/annual', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });

    const annualInsights = {};
    transactions.forEach(transaction => {
      const year = new Date(transaction.date).getFullYear();
      if (!annualInsights[year]) {
        annualInsights[year] = { income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        annualInsights[year].income += transaction.amount;
      } else {
        annualInsights[year].expense += transaction.amount;
      }
    });

    res.json(annualInsights);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
