const path = require('path');
const createUploader = require('../utils/fileUploadUtil'); // Adjust path as needed
const { Category, Product, ProductImage } = require('../models'); // Sequelize model

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

exports.createProduct = async (req, res) => {
  const uploadDir = path.join(__dirname, '../../../public_html/curtainshop/uploads/products');
  const uploader = createUploader(uploadDir).array('images'); // Array of images

  uploader(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    try {
      const { title, price, description, category_id, tik_tok } = req.body;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one image is required!',
        });
      }

      // Create the product
      const product = await Product.create({
        title,
        price,
        description,
        category_id,
        tik_tok,
      });

      // Create ProductImage records for each uploaded file
      const imageRecords = await Promise.all(
        req.files.map(file => {
          const imageUrl = `https://ikizcurtain.com/curtainshop/uploads/products/${file.filename}`;
          return ProductImage.create({
            product_id: product.id,
            img_url: imageUrl,
          });
        })
      );

      // Fetch the created product along with its images
      const createdProduct = await Product.findOne({
        where: { id: product.id },
        include: [
          {
            model: ProductImage,
            as: 'images', // Alias used in the association
          },
        ],
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully!',
        data: createdProduct,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: error.message,
      });
    }
  });
};

// Get all products with their associated images
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: ProductImage,
          as: 'images', // Matches the alias defined in the association
          attributes: [ 'img_url'], // Specify existing columns
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully!',
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message,
    });
  }
};
