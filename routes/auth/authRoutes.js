const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const authMiddleware = require('../../middlewares/authenticate');
// Define routes for user operations
router.post('/login', authController.loginUser);  // Create a user
router.post('/logout', authMiddleware, authController.logout);
router.get('/session/count', authController.countSessions);
module.exports = router;
