// routes/userRoute.js

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

// Define routes for user operations
router.post('/users', userController.createUser);  // Create a user
router.get('/users', userController.getAllUsers);  // Get all users
router.get('/users/:id', userController.getUserById);  // Get user by ID
router.put('/users/:id', userController.updateUser);
router.put('/users/:id/status', userController.updateUserStatus);
router.delete('/users/:id', userController.deleteUser);
//Count
router.get('/count/users', userController.countUserType);
module.exports = router;