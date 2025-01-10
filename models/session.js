'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      Session.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Session.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Generates UUID using Sequelize
      },
      available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        // primaryKey: true, // Ensure user_id remains as the primary key
        references: {
          model: 'users', // References the users table
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Session',
      tableName: 'sessions', // Ensure consistency with migrations
      underscored: true, // Use snake_case for column names
      timestamps: true,  // Enables createdAt and updatedAt
    }
  );

  return Session;
};
