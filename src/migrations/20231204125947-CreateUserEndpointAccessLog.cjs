'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userEndpointAccessLog', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      endpoint: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userCPF: {
        type: Sequelize.STRING(11),
        allowNull: true,
        references: { model: 'users', key: 'cpf' },
      },
      httpVerb: {
        type: Sequelize.ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE'),
        allowNull: false,
      },
      attemptTimestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      isAccepted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      service: {
        type: Sequelize.ENUM(
          'User',
          'ProcessManagment',
          'Unit',
          'Role',
          'Mailer',
          'Note',
        ),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('userEndpointAccessLog');
  },
};
