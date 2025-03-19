const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./models/inventory.db', (err) => {
    if (err) console.error(err.message);
    else console.log("Connected to SQLite database.");
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Suppliers (
            supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            contact TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Products (
            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            quantity INTEGER CHECK(quantity >= 0),
            price REAL CHECK(price >= 0),
            supplier_id INTEGER,
            description TEXT,
            FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Transactions (
            transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            quantity INTEGER CHECK(quantity <> 0),
            transaction_type TEXT CHECK(transaction_type IN ('sale', 'restock')),
            date TEXT NOT NULL,
            FOREIGN KEY (product_id) REFERENCES Products(product_id)
        )
    `);
});

db.serialize(() => {
    db.run(`
        INSERT INTO Suppliers (name, contact)
        SELECT 'Tech Supplier', 'tech@example.com'
        WHERE NOT EXISTS (SELECT 1 FROM Suppliers WHERE name = 'Tech Supplier')
    `);

    db.run(`
        INSERT INTO Suppliers (name, contact)
        SELECT 'Office Supplies', 'office@example.com'
        WHERE NOT EXISTS (SELECT 1 FROM Suppliers WHERE name = 'Office Supplies')
    `);

    db.run(`
        INSERT INTO Suppliers (name, contact)
        SELECT 'Audio Co.', 'audio@example.com'
        WHERE NOT EXISTS (SELECT 1 FROM Suppliers WHERE name = 'Audio Co.')
    `);

    db.run(`
        INSERT INTO Products (name, category, quantity, price, supplier_id, description)
        SELECT 'Laptop', 'Electronics', 10, 799.99, 1, 'High-performance laptop'
        WHERE NOT EXISTS (SELECT 1 FROM Products WHERE name = 'Laptop')
    `);

    db.run(`
        INSERT INTO Products (name, category, quantity, price, supplier_id, description)
        SELECT 'Headphones', 'Accessories', 50, 49.99, 3, 'Noise-canceling headphones'
        WHERE NOT EXISTS (SELECT 1 FROM Products WHERE name = 'Headphones')
    `);

    db.run(`
        INSERT INTO Products (name, category, quantity, price, supplier_id, description)
        SELECT 'Desk Chair', 'Furniture', 15, 199.99, 2, 'Ergonomic office chair'
        WHERE NOT EXISTS (SELECT 1 FROM Products WHERE name = 'Desk Chair')
    `);

    db.run(`
        INSERT INTO Transactions (product_id, quantity, transaction_type, date)
        SELECT 1, -2, 'sale', '2025-03-10'
        WHERE NOT EXISTS (SELECT 1 FROM Transactions WHERE product_id = 1 AND transaction_type = 'sale')
    `);

    db.run(`
        INSERT INTO Transactions (product_id, quantity, transaction_type, date)
        SELECT 2, 20, 'restock', '2025-03-09'
        WHERE NOT EXISTS (SELECT 1 FROM Transactions WHERE product_id = 2 AND transaction_type = 'restock')
    `);

    db.run(`
        INSERT INTO Transactions (product_id, quantity, transaction_type, date)
        SELECT 3, -1, 'sale', '2025-03-08'
        WHERE NOT EXISTS (SELECT 1 FROM Transactions WHERE product_id = 3 AND transaction_type = 'sale')
    `);

    console.log("Database setup complete. Default data ensured.");
});

module.exports = db;   
// Updated database setup
