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
        defaultValue: sequelize.literal('gen_random_uuid()'), // Generates UUID in PostgreSQL
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
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
        allowNull: false,
      },
      tik_tok: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      instagram: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      facebook: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      company_name: {
        type: DataTypes.STRING(255),
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
      modelName: 'User',
      tableName: 'users',
      underscored: true, // Ensures `created_at` and `updated_at` match table schema
      timestamps: true,  // Ensures Sequelize tracks createdAt/updatedAt
    }
  );

  return User;
};
