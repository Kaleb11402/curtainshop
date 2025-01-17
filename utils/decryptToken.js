const jwt = require('jsonwebtoken');

/**
 * Decrypts a token from the Authorization header.
 * @param {Object} req - The request object.
 * @returns {Object} Decoded token payload if valid.
 * @throws Will throw an error if the token is missing or invalid.
 */
const decryptToken = (req) => {
  try {
    // Retrieve the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error('Authorization header is missing.');
    }

    // Extract the token (assuming the token is passed directly in the header)
    const token = authHeader.trim();
    if (!token) {
      throw new Error('Token is missing.');
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded; // Returns the decoded token payload (e.g., { id, email })
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
};

module.exports = { decryptToken };
