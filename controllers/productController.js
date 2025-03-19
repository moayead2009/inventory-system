const db = require('../models/database');

exports.getAllProducts = (req, res) => {
    let { search, filterCategory, sortBy } = req.query;
    let sql = "SELECT * FROM Products WHERE 1=1";
    let params = [];

    if (search) {
        sql += " AND name LIKE ?";
        params.push(`%${search}%`);
    }

    if (filterCategory) {
        sql += " AND category = ?";
        params.push(filterCategory);
    }

    if (sortBy) {
        if (sortBy === "name") sql += " ORDER BY name ASC";
        if (sortBy === "priceAsc") sql += " ORDER BY price ASC";
        if (sortBy === "priceDesc") sql += " ORDER BY price DESC";
        if (sortBy === "quantity") sql += " ORDER BY quantity DESC";
    }

    db.all(sql, params, (err, products) => {
        if (err) {
            return res.status(500).send("Error fetching products.");
        }

        products.forEach(product => {
            product.lowStock = product.quantity < 5; 
        });

        const message = req.session.productMessage || null;
        req.session.productMessage = null;

        res.render("products", { products, message });
    });
};

exports.addProduct = (req, res) => {
    const { name, category, quantity, price, supplier_id, description } = req.body;

    if (!name || !category || !quantity || !price || !supplier_id) {
        req.session.productMessage = "All fields are required.";
        return res.redirect("/products");
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
        req.session.productMessage = "Product name must only contain letters and numbers.";
        return res.redirect("/products");
    }

    if (!["Electronics", "Furniture", "Accessories"].includes(category)) {
        req.session.productMessage = "Invalid category selection.";
        return res.redirect("/products");
    }

    db.run(
        "INSERT INTO Products (name, category, quantity, price, supplier_id, description) VALUES (?, ?, ?, ?, ?, ?)",
        [name, category, quantity, price, supplier_id, description],
        (err) => {
            if (err) {
                req.session.productMessage = "Error adding product.";
                return res.redirect("/products");
            }
            req.session.productMessage = "Product added successfully!";
            res.redirect("/products");
        }
    );
};

exports.deleteProduct = (req, res) => {
    const productId = req.params.id;
    db.run("DELETE FROM Products WHERE product_id = ?", [productId], (err) => {
        if (err) {
            req.session.productMessage = "Error deleting product.";
        } else {
            req.session.productMessage = "Product deleted successfully!";
        }
        res.redirect('/products');
    });
};

exports.getEditProduct = (req, res) => {
    const productId = req.params.id;
    db.get("SELECT * FROM Products WHERE product_id = ?", [productId], (err, product) => {
        if (err) {
            req.session.productMessage = "Error retrieving product.";
            return res.redirect("/products");
        }
        res.render('editProduct', { product });
    });
};

exports.updateProduct = (req, res) => {
    const productId = req.params.id;
    const { name, category, quantity, price, supplier_id, description } = req.body;

    db.run(
        `UPDATE Products SET name = ?, category = ?, quantity = ?, price = ?, supplier_id = ?, description = ? WHERE product_id = ?`,
        [name, category, quantity, price, supplier_id, description, productId],
        (err) => {
            if (err) {
                req.session.productMessage = "Error updating product.";
            } else {
                req.session.productMessage = "Product updated successfully!";
            }
            res.redirect('/products');
        }
    );
};
// Added product CRUD operations
// Added product CRUD operations
