'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'), // Automatically generate UUID
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT(53), // Supports FLOAT with precision
        allowNull: false,
      },
      description: {
        type: Sequelize.JSON, // JSON datatype for structured data
        allowNull: false,
      },
      tik_tok: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'categories', // Refers to the 'categories' table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  },
};
