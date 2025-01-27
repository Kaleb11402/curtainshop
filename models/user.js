'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here, if any
      // Example: User.hasMany(models.Post, { foreignKey: 'userId' });
    }
  }

  User.init(
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
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      telegram: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tik_tok: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instagram: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      facebook: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      language: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
      },
      company_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
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
      modelName: 'User',
      tableName: 'users',
      underscored: true, // Ensures `created_at` and `updated_at` match table schema
      timestamps: true,  // Ensures Sequelize tracks createdAt/updatedAt
    }
  );

  return User;
};
