const db = require('../models/database');

exports.getTransactions = (req, res) => {
    db.all(`SELECT * FROM Transactions`, [], (err, rows) => {
        if (err) {
            return res.status(500).send("Error retrieving transactions.");
        }
        res.render('transactions', { transactions: rows });
    });
};

exports.addTransaction = (req, res) => {
    const { product_id, quantity, transaction_type } = req.body;
    const date = new Date().toISOString().split('T')[0];

    db.run(`INSERT INTO Transactions (product_id, quantity, transaction_type, date) VALUES (?, ?, ?, ?)`, 
    [product_id, quantity, transaction_type, date], 
    (err) => {
        if (err) {
            return res.status(500).send("Error adding transaction.");
        }
        res.redirect('/transactions');
    });
};
