// routes/userRoute.js

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');

// Define routes for user operations
router.post('/category', productController.createCategory);  // Create a user

module.exports = router;
