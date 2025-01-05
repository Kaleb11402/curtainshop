// routes/userRoute.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define routes for user operations
router.post('/users', userController.createUser);  // Create a user
router.get('/users', userController.getAllUsers);  // Get all users
router.get('/users/:id', userController.getUserById);  // Get user by ID

module.exports = router;
