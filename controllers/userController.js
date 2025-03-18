const db = require('../models/database');
const bcrypt = require('bcrypt');

exports.signup = (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM Users WHERE username = ?`, [username], (err, user) => {
        if (user) {
            return res.render('signup', { error: "This email is already registered." });
        }
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.render('signup', { error: "An error occurred. Please try again." });
            }
            db.run(`INSERT INTO Users (username, password) VALUES (?, ?)`, [username, hash], (err) => {
                if (err) {
                    return res.render('signup', { error: "Error creating user." });
                }
                return res.render('signup', { success: "Registration successful! You can now log in." });
            });
        });
    });
};


exports.login = (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM Users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) {
            return res.render('login', { error: "Invalid username or password." });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                req.session.user = user;
                req.session.message = `Welcome, ${user.username}`;
                res.redirect('/');
            } else {
                res.render('login', { error: "Invalid username or password." });
            }
        });
    });
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
