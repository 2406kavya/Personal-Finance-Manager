// server/routes/transactions.js

const express = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a transaction
router.post('/', authMiddleware, async (req, res) => {
  const { description, amount, type } = req.body;

  const newTransaction = new Transaction({
    userId: req.user.id,
    description,
    amount,
    type,
  });

  try {
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all transactions for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
