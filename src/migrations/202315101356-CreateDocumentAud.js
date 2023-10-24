'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('documentAud', {
            idDocumentAud: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            uuid: {
                type: Sequelize.STRING(36),
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM('PROCESS_EVENTS_XLSX', 'PROCESS_EVENTS_PDF'),
                allowNull: false,
            },
            emitedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            emitedBy: {
                type: Sequelize.STRING(11),
                allowNull: false,
                references: { model: 'user', key: 'cpf' },
                onDelete: 'RESTRICT',
            },
        }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('documentAud');
    },
};
