// controllers/userController.js

const { User } = require('../models'); // Import User model

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, type, telegram, tik_tok, instagram, facebook, language, address, phone, company_name } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      type,
      telegram,
      tik_tok,
      instagram,
      facebook,
      language,
      address,
      phone,
      company_name,
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
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
