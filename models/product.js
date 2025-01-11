'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      Product.hasMany(models.ProductImage, {
        foreignKey: 'product_id',
        as: 'images', // Alias for the association
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Generates UUID using Sequelize
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT(53),
        allowNull: false,
      },
      description: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      tik_tok: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.UUID,
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
      modelName: 'Product',
      tableName: 'products',
      underscored: true, // Ensures snake_case column names
      timestamps: true,  // Enables createdAt and updatedAt timestamps
    }
  );

  return Product;
};
