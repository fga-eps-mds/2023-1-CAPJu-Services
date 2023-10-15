'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('process', {
      idProcess: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      record: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: 'unique_processRecord_idStage',
      },
      idFlow: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      nickname: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      finalised: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      effectiveDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      idUnit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      idStage: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: 'unique_processRecord_idStage',
      },
      idPriority: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('inProgress', 'archived', 'finished', 'notStarted'),
        allowNull: false,
        defaultValue: 'notStarted',
      },
    });

    await queryInterface.addIndex('process', ['record', 'idStage'], {
      unique: true,
      name: 'unique_processRecord_idStage',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('process');
  },
};
