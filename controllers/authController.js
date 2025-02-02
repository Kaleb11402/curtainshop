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
      loginSchema.validate({ email, password });
      // Find the user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'User is not active',
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

  exports.logout = async (req, res) => {
    try {
      const user_id = req.user.id;
      const authToken = req.headers.authorization; // Get the authorization token from the request headers
      console.log("Auth token ", authToken)
      const session = await Session.findOne({
        where: { user_id: user_id },
      });
  
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found.',
        });
      }
  
      if (!session.available) {
        return res.status(404).json({
          success: false,
          message: 'The user already logged out!',
        });
      }
  
      if (session.data !== authToken) {
        return res.status(401).json({
          success: false,
          message: "The token is expired",
        });
      }
      
      // Invalidate the session
      session.available = false;
      session.data = '';
      await session.save();
  
      res.status(200).json({
        success: true,
        message: 'User logged out successfully.',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  };
  
  exports.countSessions = async (req, res) => {
    try {
      const totalSession = await Session.count().where({ available: true });
  
      res.status(200).json({
        success: true,
        totalSessions: totalSession,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Failed to count sessions',
        error: error.message,
      });
    }
  }