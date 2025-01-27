const { json } = require('body-parser');
const {Product, ProductImage, FavouriteProduct} = require('../models');

exports.addFavouriteProduct = async (req, res) => {
    try{
      const user_id = req.user.id;
      const {product_id} = req.body;
      if (!product_id){
        return res.status(400).json({
            success: false,
            message: "Product ID is required.",
        })
      }
      const product = await Product.findOne({
        where: {id: product_id},
      })
      if(!product){
        return res.status(400).json({
            success: false,
            message: "Product not found."
        })
      }
const existingFavouriteProduct = await FavouriteProduct.findOne({
    where: {product_id, user_id}
})
if(existingFavouriteProduct){
    return res.status(400).json({
        success: false,
        message: "Product already added to favourite"
    })
}

const favouriteProduct = await FavouriteProduct.create({
    user_id,
    product_id
})
res.status(201).json({
    success: true,
    message: "Product successfully added to favourite",
    data: favouriteProduct
})
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Failed to add product to favourite.',
            error: error.message,
          });
    }
}

exports.getMyFavouriteProducts = async (req, res) => {
    try {
      const user_id = req.user.id; // Extract user_id from middleware
  
      // Fetch all favourite items for the user with their product and image details
      const favouriteItems = await FavouriteProduct.findAll({
        where: { user_id },
        include: [
          {
            model: Product,
            as: 'product', // Use the alias defined in the favourite model association
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
  
      if (!favouriteItems || favouriteItems.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No items found in the favourite.',
        });
      }
  
      // Map the result to include product and image details with favourite info
      const favouriteWithProductInfo = favouriteItems.map((item) => ({
        favourite_id: item.id,
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
        message: 'Favourite items fetched successfully.',
        data: favouriteWithProductInfo,
      });
    } catch (error) {
      console.error('Error fetching favourite items:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch favourite items.',
        error: error.message,
      });
    }
  };
exports.getfavouriteItemsByUserID = async (req, res) => {
    try {
      const user_id = req.params.id; // Extract user_id from middleware
  
      // Fetch all favourite items for the user with their product and image details
      const favouriteItems = await FavouriteProduct.findAll({
        where: { user_id },
        include: [
          {
            model: Product,
            as: 'product', // Use the alias defined in the favourite model association
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
  
      if (!favouriteItems || favouriteItems.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No items found in the favourite.',
        });
      }
  
      // Map the result to include product and image details with favourite info
      const favouriteWithProductInfo = favouriteItems.map((item) => ({
        favouriteproduct_id: item.id,
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
        message: 'Favourite items fetched successfully.',
        data: favouriteWithProductInfo,
      });
    } catch (error) {
      console.error('Error fetching favourite items:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch favourite items.',
        error: error.message,
      });
    }
  };
exports.deleteFavouriteItem = async (req, res) => {
    try {
      const user_id = req.user.id; // Extract user ID from middleware
      const { favouriteproduct_id, product_id } = req.body;
  
      // Ensure at least one identifier is provided
      if (!favouriteproduct_id && !product_id) {
        return res.status(400).json({
          success: false,
          message: 'Either favouriteproduct_id or product_id is required to delete an item.',
        });
      }
  
      // Build the query condition
      const condition = { user_id }; // User-specific favourite
      if (favouriteproduct_id) condition.id = favouriteproduct_id;
      if (product_id) condition.product_id = product_id;
  
      // Check if the favourite item exists
      const favouriteItem = await FavouriteProduct.findOne({ where: condition });
      if (!favouriteItem) {
        return res.status(404).json({
          success: false,
          message: 'Favourite item not found.',
        });
      }
  
      // Delete the favourite item
      await FavouriteProduct.destroy({ where: condition });
  
      res.status(200).json({
        success: true,
        message: 'Favourite product item deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting favourite item:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete favourite item.',
        error: error.message,
      });
    }
  };