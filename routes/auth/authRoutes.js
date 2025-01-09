const express = require('express');
const router = express.Router();
const userController = require('../../controllers/authController');

// Define routes for user operations
router.post('/login', userController.loginUser);  // Create a user

module.exports = router;
