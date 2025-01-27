const { json } = require('body-parser');
const {Product, Favourite_product} = require('../models');

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
const existingFavouriteProduct = await Favourite_product.findOne({
    where: {product_id, user_id}
})
if(existingFavouriteProduct){
    return res.status(400).json({
        success: false,
        message: "Product already added to favourite"
    })
}

const favouriteProduct = await Favourite_product.create({
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