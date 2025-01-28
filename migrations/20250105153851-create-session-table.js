'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', { // Use plural naming convention
      id: { // Add the id column as the primary key
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4, // Automatically generate UUID
      },
      available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      data: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // primaryKey: true, // Use user_id as primary key
        references: {
          model: 'users', // References the users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Default to current timestamp
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Default to current timestamp
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sessions'); // Use plural naming convention
  },
};
