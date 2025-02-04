// routes/promotionRoute.js

const express = require('express');
const router = express.Router();
const promotionController = require('../../controllers/promotionController');

// Define routes for promotion operations
router.post('', promotionController.createPromotion);  // Create a promotion
router.get('', promotionController.getAllPromotions);
router.get('/:id', promotionController.getPromotionByID)
router.delete('/:id', promotionController.deletePromotion)
module.exports = router;