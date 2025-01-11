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

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID with associated images
    const product = await Product.findOne({
      where: { id },
      include: [
        {
          model: ProductImage,
          as: 'images', // Alias defined in the association
          attributes: ['img_url'], // Include only the img_url column
        },
      ],
    });

    // If no product is found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Return the product with associated images
    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product by ID:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message,
    });
  }
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

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Product ID
    const { title, price, description, tik_tok, category_id, delete_images } = req.body;

    // Find the product by ID
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update the product fields
    await product.update({
      title,
      price,
      description: description ? JSON.parse(description) : product.description,
      tik_tok,
      category_id,
    });

    // Delete specific images if requested
    if (delete_images) {
      const imagesToDelete = JSON.parse(delete_images); // Parse the JSON array of image URLs
      for (const imgUrl of imagesToDelete) {
        // Extract the filename from the URL
        const filename = path.basename(imgUrl);
        const imagePath = path.join(__dirname, '../../../public_html/curtainshop/uploads/products', filename);

        // Find the image record in the database
        const image = await ProductImage.findOne({ where: { img_url: imgUrl, product_id: id } });

        if (image) {
          // Delete the image file from the filesystem
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Remove the file from the directory
          }

          // Delete the image record from the database
          await image.destroy();
        }
      }
    }

    // Fetch the updated product with images
    const updatedProduct = await Product.findOne({
      where: { id },
      include: [
        {
          model: ProductImage,
          as: 'images',
          attributes: ['img_url'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

exports.addProductImages = async (req, res) => {
  const uploadDir = path.join(__dirname, '../../../public_html/curtainshop/uploads/products');
  const uploader = createUploader(uploadDir).array('images'); // To handle multiple images

  uploader(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Image upload failed',
        error: err.message,
      });
    }

    try {
      const { id } = req.params; // Product ID

      // Check if the product exists
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      // Check the current number of images for the product
      const existingImagesCount = await ProductImage.count({ where: { product_id: id } });
      const newImagesCount = req.files.length;

      if (existingImagesCount + newImagesCount > 5) {
        return res.status(400).json({
          success: false,
          message: 'A product can have a maximum of 5 images',
        });
      }

      // Save the new images to the database
      const newImages = req.files.map((file) => ({
        product_id: id,
        img_url: `https://ikizcurtain.com/curtainshop/uploads/products/${file.filename}`,
      }));
      await ProductImage.bulkCreate(newImages);

      // Fetch updated product with images
      const updatedProduct = await Product.findOne({
        where: { id },
        include: [
          {
            model: ProductImage,
            as: 'images',
            attributes: ['img_url'],
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: 'Images added successfully',
        data: updatedProduct,
      });
    } catch (error) {
      console.error('Error adding product images:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to add images',
        error: error.message,
      });
    }
  });
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Product ID

    // Find the product by ID
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Fetch all associated product images
    const productImages = await ProductImage.findAll({ where: { product_id: id } });

    // Delete images from the file system
    for (const image of productImages) {
      const filename = path.basename(image.img_url);
      const imagePath = path.join(__dirname, '../../../public_html/curtainshop/uploads/products', filename);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Remove the file
      }

      // Delete image record from the database
      await image.destroy();
    }

    // Delete the product record
    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};