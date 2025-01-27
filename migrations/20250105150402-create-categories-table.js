'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('UUID()'),
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      img_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      // created_at: {
      //   type: Sequelize.DATE,
      //   allowNull: false,
      //   defaultValue: Sequelize.NOW,
      // },
      // updated_at: {
      //   type: Sequelize.DATE,
      //   allowNull: false,
      //   defaultValue: Sequelize.NOW,
      // },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  },
};
