'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('process', {
      record: {
        type: Sequelize.STRING(20),
        unique: true,
        primaryKey: true,
        allowNull: false,
      },
      nickname: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      effectiveDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      finalised: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      idFlow: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'flow', key: 'idFlow' },
        onDelete: 'RESTRICT',
      },
      idUnit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM({
          values: ['inProgress', 'archived', 'finished', 'notStarted'],
        }),
        defaultValue: 'notStarted',
        allowNull: false,
      },
      idStage: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'stage', key: 'idStage' },
        onDelete: 'RESTRICT',
        defaultValue: 0,
      },
      idPriority: {
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
    await queryInterface.dropTable('process');
  },
};
