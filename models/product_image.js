'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      ProductImage.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      ProductImage.belongsTo(Product, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  ProductImage.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Generates UUID using Sequelize
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'products', // References the products table
          key: 'id',
        },
      },
      img_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ProductImage',
      tableName: 'product_image',
      underscored: true, // Ensures snake_case column names
      timestamps: true,  // Enables createdAt and updatedAt timestamps
    }
  );

  return ProductImage;
};
