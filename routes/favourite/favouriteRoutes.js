// routes/favouriteRoute.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authenticate');
const favouriteController = require('../../controllers/favouriteController');

// Define routes for favourite operations
router.post('', authMiddleware, favouriteController.addFavouriteProduct);  // Create a favourite
// router.put('', authMiddleware, favouriteController.updatefavouriteQuantity);
router.get('', authMiddleware, favouriteController.getMyFavouriteProducts);
router.get('/:id', favouriteController.getfavouriteItemsByUserID);
router.delete('', authMiddleware, favouriteController.deleteFavouriteItem);
module.exports = router;
