'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('processAud', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            idProcess: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'process',
                    key: 'idProcess'
                }
            },
            processRecord: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            operation: {
                type: Sequelize.ENUM('INSERT', 'UPDATE', 'DELETE', 'NOTE_CHANGE'),
                allowNull: false,
            },
            changedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            changedBy: {
                type: Sequelize.STRING(11),
                allowNull: false,
            },
            oldValues: {
                type: Sequelize.JSONB,
                allowNull: true,
            },
            newValues: {
                type: Sequelize.JSONB,
                allowNull: true,
            },
            remarks: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('processAud');
    },
};
