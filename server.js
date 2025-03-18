const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./models/database');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }
}));

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');

app.use(express.static('public'));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.get('/', (req, res) => {
    const queries = {
        productCount: `SELECT COUNT(*) AS count FROM Products`,
        transactionCount: `SELECT COUNT(*) AS count FROM Transactions`,
        userCount: `SELECT COUNT(*) AS count FROM Users`
    };
    let counts = { productCount: 0, transactionCount: 0, userCount: 0 };
    db.get(queries.productCount, [], (err, result) => {
        if (!err && result) counts.productCount = result.count;
        db.get(queries.transactionCount, [], (err, result) => {
            if (!err && result) counts.transactionCount = result.count;
            db.get(queries.userCount, [], (err, result) => {
                if (!err && result) counts.userCount = result.count;
                res.render('home', {
                    productCount: counts.productCount,
                    transactionCount: counts.transactionCount,
                    userCount: counts.userCount
                });
            });
        });
    });
});

app.use(productRoutes);
app.use(userRoutes);
app.use(transactionRoutes);

app.use((req, res, next) => {
    res.status(404).send('<h1>404 - Page Not Found</h1><p><a href="/">Go Home</a></p>');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('<h1>500 - Server Error</h1><p>Something went wrong.</p>');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
