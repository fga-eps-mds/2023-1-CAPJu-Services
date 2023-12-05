'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('processesFileItem');

    await queryInterface.dropTable('processesFile');

    await queryInterface.createTable('processesFile', {
      idProcessesFile: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          'waiting',
          'inProgress',
          'error',
          'canceled',
          'imported',
        ),
        allowNull: false,
        defaultValue: 'waiting',
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      importedBy: {
        type: Sequelize.STRING(11),
        allowNull: false,
        references: { model: 'users', key: 'cpf' },
        onDelete: 'RESTRICT',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      importedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fileName: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      dataOriginalFile: {
        type: Sequelize.BLOB,
        allowNull: false,
      },
      dataResultingFile: {
        type: Sequelize.BLOB,
        allowNull: true,
      },
    });

    await queryInterface.createTable('processesFileItem', {
      idProcessesFileItem: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      idProcessesFile: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'processesFile',
          key: 'idProcessesFile',
        },
      },
      idProcess: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'process',
          key: 'idProcess',
        },
      },
      record: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      nickname: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      flow: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      priority: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('imported', 'manuallyImported', 'error'),
        allowNull: false,
        defaultValue: 'error',
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
