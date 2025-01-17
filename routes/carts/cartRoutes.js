// routes/cartRoute.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authenticate');
const cartController = require('../../controllers/cartController');

// Define routes for cart operations
router.post('', authMiddleware, cartController.addToCart);  // Create a cart
router.put('', authMiddleware, cartController.updateCartQuantity);
router.get('', authMiddleware, cartController.getCartItems);
module.exports = router;
