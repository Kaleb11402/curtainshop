'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here, if any
      // Example: Promotion.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  Promotion.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: sequelize.literal('gen_random_uuid()'), // Automatically generate UUID
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
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
      modelName: 'Promotion',
      tableName: 'promotions',
      underscored: true, // Ensures snake_case column names
      timestamps: true,  // Enables createdAt and updatedAt timestamps
    }
  );

  return Promotion;
};
