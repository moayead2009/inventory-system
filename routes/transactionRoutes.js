const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

const isAuthenticated = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
};

router.get('/transactions', isAuthenticated, transactionController.getTransactions);
router.post('/transactions/add', isAuthenticated, transactionController.addTransaction);

module.exports = router;
// Updated transaction routes
