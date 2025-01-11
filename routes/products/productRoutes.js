// routes/categoryRoute.js

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');

// Define routes for category operations
router.post('/category', productController.createCategory);  // Create a category
router.get('/category', productController.getAllCategories);
router.post('', productController.createProduct);
router.get('', productController.getAllProducts);
module.exports = router;
