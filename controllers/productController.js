const path = require('path');
const createUploader = require('../utils/fileUploadUtil'); // Adjust path as needed
const { Category } = require('../models'); // Sequelize model

exports.createCategory = async (req, res) => {
  // Dynamically create the uploader for category images
  const uploadDir = path.join(__dirname, '../../../public_html/curtainshop/uploads/categories');
  const uploader = createUploader(uploadDir).single('image');

  // Use the uploader middleware
  uploader(req, res, async (err) => {
    if (err) {
      console.log("Here is the error ", err);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    try {
      const { name } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Image file is required!',
        });
      }

      // Check if the category name already exists
      const existingCategory = await Category.findOne({ where: { name } });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category name already exists!',
        });
      }

      // Construct the image URL
      const imgUrl = `https://ikizcurtain.com/curtainshop/uploads/categories/${req.file.filename}`;

      // Create the category
      const category = await Category.create({
        name,
        img_url: imgUrl,
      });

      res.status(201).json({
        success: true,
        message: 'Category created successfully!',
        data: category,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to create category',
        error: error.message,
      });
    }
  });
};


exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error.message,
    });
  }
};