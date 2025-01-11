// routes/categoryRoute.js

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');

// Define routes for category operations
router.post('/category', productController.createCategory);  // Create a category
router.get('/category', productController.getAllCategories);
router.put('/category/:id', productController.updateCategory);
router.delete('/category/:id', productController.deleteCategory);
router.post('', productController.createProduct);
router.get('', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.post('/:id/images', productController.addProductImages);
router.delete('/:id', productController.deleteProduct);
router.get('/category/:id/products', productController.getCategoryWithProducts);
module.exports = router;
