const path = require('path');
const fs = require('fs');
const createUploader = require('../utils/fileUploadUtil'); // Adjust path as needed
const { Promotion } = require('../models'); // Sequelize model
const { where } = require('sequelize');

exports.createPromotion = async (req, res) => {
  // Dynamically create the uploader for promotion images
  const uploadDir = path.join(__dirname, '../../../public_html/curtainshop/uploads/promotions');
  const uploader = createUploader(uploadDir).single('image');

  // Use the uploader middleware
  uploader(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    try {
      const { title } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Image file is required!',
        });
      }

      // Construct the image URL
      const imgUrl = `https://ikizcurtain.com/curtainshop/uploads/promotions/${req.file.filename}`;

      // Create the promotion
      const promotion = await Promotion.create({
        title,
        img_url: imgUrl,
      });

      res.status(201).json({
        success: true,
        message: 'Promotion created successfully!',
        data: promotion,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to create promotion',
        error: error.message,
      });
    }
  });
};

exports.getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.findAll();
        res.status(200).json({
            success: true,
            data: promotions,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrive promotions',
            error: error.message,
        })
    }
}

exports.getPromotionByID = async (req, res) => {
    try {
        const {id} = req.params;

        const promotion = await Promotion.findOne({
            where:{id}
        })
        if (!promotion){
          return  res.status(404).json({
                success: false,
                message:"Promotion not found"
            })
            
        }
      return  res.status(200).json({
            success: true,
            message:"Promotion retrived successfully",
            data: promotion
        })
    } catch (error) {
      return  res.status(500).json({
            success: false,
            message:"Failed to retrive promotion",
            error: error.message,
        })
    }
}

exports.deletePromotion = async (req, res) =>{
    try {
       const {id} = req.params
       const promotion = await Promotion.findOne({
           where: {id}
       })
       if (!promotion) {
        return res.status(404).json({
            success: false,
            message: "Promotion not found",
        })
       }
       const imagePath = path.join(__dirname, '../../../public_html/curtainshop/uploads/promotions', path.basename(promotion.img_url));
       if(fs.existsSync(imagePath)){
        fs.unlinkSync(imagePath);
       }
       await promotion.destroy();
       return res.status(200).json({
        success: true,
        message: "Promotion deleted successfully!"
       })

    } catch (error) {
       return res.status(200).json({
            success: true,
            message: "Failed to delete promotion",
            error: error.message
        })
    }
}
