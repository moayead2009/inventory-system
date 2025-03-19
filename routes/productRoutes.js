const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const isAuthenticated = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
};

router.get('/products', isAuthenticated, productController.getAllProducts);
router.post('/products/add', isAuthenticated, productController.addProduct);
router.post('/products/delete/:id', isAuthenticated, productController.deleteProduct);
router.get('/products/edit/:id', isAuthenticated, productController.getEditProduct);
router.post('/products/update/:id', isAuthenticated, productController.updateProduct);

module.exports = router;
// Updated product routes
