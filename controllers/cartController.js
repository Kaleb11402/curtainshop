const { Cart, Product, ProductImage } = require('../models'); // Import models

exports.addToCart = async (req, res) => {
    try {
      const user_id = req.user.id; // Extract user_id from middleware
      const { product_id } = req.body;
  
      if (!product_id) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required.',
        });
      }
  
      // Fetch product details to get the price
      const product = await Product.findOne({
        where: { id: product_id },
        attributes: ['price'], // Fetch only the price
      });
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found.',
        });
      }
  
      const price = product.price;
  
      // Check if the product already exists in the cart
      const existingCartItem = await Cart.findOne({
        where: { user_id, product_id },
      });
  
      if (existingCartItem) {
        return res.status(400).json({
          success: false,
          message: 'Product already in the cart. Use the update quantity API to modify the quantity.',
        });
      }
  
      // Add product to the cart with default quantity 1 and price
      const cartItem = await Cart.create({
        user_id,
        product_id,
        quantity: 1,
        total_price: price, // Set the total price as price * quantity (1)
      });
  
      res.status(201).json({
        success: true,
        message: 'Product added to cart successfully.',
        data: cartItem,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add product to cart.',
        error: error.message,
      });
    }
  };
  
  
  
exports.updateCartQuantity = async (req, res) => {
    try {
      const user_id = req.user.id; // Extract user_id from the middleware
      const { product_id, quantity } = req.body;
  
      if (!product_id || !quantity) {
        return res.status(400).json({
          success: false,
          message: 'Product ID and quantity are required.',
        });
      }
  
      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1.',
        });
      }
  
      const cartItem = await Cart.findOne({
        where: { user_id, product_id },
        include: [{ model: Product, as: 'product', attributes: ['price'] }], // Include product details for price
      });
  
      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: 'Product not found in the cart.',
        });
      }
  
      const price = cartItem.product.price; // Get the product price
  
      // Update quantity and total price
      cartItem.quantity = quantity;
      cartItem.total_price = quantity * price;
      await cartItem.save();
  
      res.status(200).json({
        success: true,
        message: 'Cart quantity and total price updated successfully.',
        data: cartItem,
      });
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update cart quantity.',
        error: error.message,
      });
    }
  };
  
exports.getCartItems = async (req, res) => {
    try {
      const user_id = req.user.id; // Extract user_id from middleware
  
      // Fetch all cart items for the user with their product and image details
      const cartItems = await Cart.findAll({
        where: { user_id },
        include: [
          {
            model: Product,
            as: 'product', // Use the alias defined in the Cart model association
            attributes: ['id', 'title', 'description', 'price'], // Get product details
            include: [
              {
                model: ProductImage,
                as: 'images', // Matches the alias defined in Product-ProductImage association
                attributes: ['img_url'], // Specify the image URL column
              },
            ],
          },
        ],
      });
  
      if (!cartItems || cartItems.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No items found in the cart.',
        });
      }
  
      // Map the result to include product and image details with cart info
      const cartWithProductInfo = cartItems.map((item) => ({
        cart_id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        total_price: item.total_price,
        product: {
          ...item.product.get(),
          images: item.product.images.map((img) => img.img_url), // Extract image URLs
        },
      }));
  
      res.status(200).json({
        success: true,
        message: 'Cart items fetched successfully.',
        data: cartWithProductInfo,
      });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cart items.',
        error: error.message,
      });
    }
  };
  exports.getCartItemsByUserID = async (req, res) => {
    try {
      const user_id = req.params.id; // Extract user_id from middleware
  
      // Fetch all cart items for the user with their product and image details
      const cartItems = await Cart.findAll({
        where: { user_id },
        include: [
          {
            model: Product,
            as: 'product', // Use the alias defined in the Cart model association
            attributes: ['id', 'title', 'description', 'price'], // Get product details
            include: [
              {
                model: ProductImage,
                as: 'images', // Matches the alias defined in Product-ProductImage association
                attributes: ['img_url'], // Specify the image URL column
              },
            ],
          },
        ],
      });
  
      if (!cartItems || cartItems.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No items found in the cart.',
        });
      }
  
      // Map the result to include product and image details with cart info
      const cartWithProductInfo = cartItems.map((item) => ({
        cart_id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        total_price: item.total_price,
        product: {
          ...item.product.get(),
          images: item.product.images.map((img) => img.img_url), // Extract image URLs
        },
      }));
  
      res.status(200).json({
        success: true,
        message: 'Cart items fetched successfully.',
        data: cartWithProductInfo,
      });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cart items.',
        error: error.message,
      });
    }
  };
exports.deleteCartItem = async (req, res) => {
    try {
      const user_id = req.user.id; // Extract user ID from middleware
      const { cart_id, product_id } = req.body;
  
      // Ensure at least one identifier is provided
      if (!cart_id && !product_id) {
        return res.status(400).json({
          success: false,
          message: 'Either cart_id or product_id is required to delete an item.',
        });
      }
  
      // Build the query condition
      const condition = { user_id }; // User-specific cart
      if (cart_id) condition.id = cart_id;
      if (product_id) condition.product_id = product_id;
  
      // Check if the cart item exists
      const cartItem = await Cart.findOne({ where: condition });
      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: 'Cart item not found.',
        });
      }
  
      // Delete the cart item
      await Cart.destroy({ where: condition });
  
      res.status(200).json({
        success: true,
        message: 'Cart item deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting cart item:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete cart item.',
        error: error.message,
      });
    }
  };