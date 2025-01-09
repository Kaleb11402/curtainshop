// controllers/userController.js
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models'); // Import User model
// Define the validation schema
const userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
    type: Joi.string(),
    telegram: Joi.string().optional(),
    tik_tok: Joi.string().optional(),
    instagram: Joi.string().optional(),
    facebook: Joi.string().optional(),
    language: Joi.string().optional(),
    address: Joi.string().optional(),
    phone: Joi.string().optional(),
    company_name: Joi.string().optional(),
  });
  exports.createUser = async (req, res) => {
    try {
      // Validate the request body
      const { error, value } = userSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
          error: 'Validation error',
        });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(value.password, 10); // 10 is the salt rounds
      value.password = hashedPassword; // Replace plain password with hashed password
  
      // Create the user
      const user = await User.create(value);
  
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error(error);
  
      // Check if the error is a duplicate entry
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: error.errors[0].message,
          error: 'Duplicate entry error', // Extracts the database error message
        });
      }
  
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: error.message,
      });
    }
  };
// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message,
    });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      error: error.message,
    });
  }
};
