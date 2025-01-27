'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here, if any
      Category.hasMany(models.Product, { foreignKey: 'category_id', as: 'products', // Alias used in the `include` option
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', });
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Generates UUID using Sequelize
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      img_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // created_at: {
      //   type: DataTypes.DATE,
      //   allowNull: false,
      //   defaultValue: DataTypes.NOW,
      // },
      // updated_at: {
      //   type: DataTypes.DATE,
      //   allowNull: false,
      //   defaultValue: DataTypes.NOW,
      // },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      underscored: true, // Ensures snake_case column names
      timestamps: true,  // Enables createdAt and updatedAt timestamps
    }
  );

  return Category;
};
