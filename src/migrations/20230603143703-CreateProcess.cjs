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
      idFlow: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: { model: 'flow', key: 'idFlow' },
        onDelete: 'RESTRICT',
      },
      idUnit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: { model: 'unit', key: 'idUnit' },
        onDelete: 'RESTRICT',
      },
      idStage: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: true,
        unique: 'unique_processRecord_idStage',
        references: { model: 'stage', key: 'idStage' },
        onDelete: 'RESTRICT',
        defaultValue: 0,
      },
      idPriority: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
        references: { model: 'priority', key: 'idPriority' },
        onDelete: 'RESTRICT',
      },
      record: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: 'unique_processRecord_idStage',
      },
      nickname: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      finalised: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      effectiveDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM({
          values: ['inProgress', 'archived', 'finished', 'notStarted'],
        }),
        defaultValue: 'notStarted',
        allowNull: false,
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
