const { decryptToken } = require('../utils/decryptToken');

const authMiddleware = (req, res, next) => {
  try {
    const user = decryptToken(req); // Decrypt token to get user data
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access.',
      });
    }
    req.user = user; // Attach the user object to the request
    next(); // Pass control to the next middleware/route handler
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Invalid or missing token.',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
