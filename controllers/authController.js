const bcrypt = require('bcrypt'); // To compare passwords
const jwt = require('jsonwebtoken'); // To generate JWT
const Joi = require('joi'); // Validation library
const { User, Session } = require('../models'); // Import User model

// Define the login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
  
      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
      );
      // Check if session exists
      const session = await Session.findOne({ where: { user_id: user.id } });
      if (session) {
        console.log("Here is the session", session)
        // Update the session
        await session.update({ data: token, available: true });
      } else {
        // Create a new session
        await Session.create({
          user_id: user.id,
          data: token,
          available: true,
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Failed to log in',
        error: error.message,
      });
    }
  };