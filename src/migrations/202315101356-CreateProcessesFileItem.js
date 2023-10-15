'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('processesFileItem', {
            idProcessesFileItem: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            idProcessesFile: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'processesFile',
                    key: 'idProcessesFile'
                }
            },
            idProcess: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'process',
                    key: 'idProcess'
                }
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
                type: Sequelize.ENUM('imported', 'error'),
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

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('processesFileItem');
    },
};
