'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('note', {
      idNote: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      commentary: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      record: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      idStageA: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idStageB: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('note');
  }
};
