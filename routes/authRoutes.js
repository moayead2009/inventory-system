const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/signup', (req, res) => {
    res.send(`
        <h2>Sign Up</h2>
        <form action="/signup" method="POST">
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="email" name="email" placeholder="Email" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Sign Up</button>
        </form>
    `);
});

router.post('/signup', userController.signup);

router.get('/login', (req, res) => {
    res.send(`
        <h2>Login</h2>
        <form action="/login" method="POST">
            <input type="email" name="email" placeholder="Email" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
    `);
});

router.post('/login', userController.login);
router.get('/logout', userController.logout);

module.exports = router;
// Updated auth routes
