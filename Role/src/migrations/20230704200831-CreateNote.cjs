'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('note', {
      idNote: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      commentary: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      record: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      idStageA: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      idStageB: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('note');
  },
};
