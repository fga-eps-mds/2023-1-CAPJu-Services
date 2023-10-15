'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
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
                type: Sequelize.ENUM('waiting', 'inProgress', 'error', 'canceled'),
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
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('processesFile');
    },
};
