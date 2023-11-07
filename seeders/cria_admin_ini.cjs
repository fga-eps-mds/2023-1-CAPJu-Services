'use strict';

const argon2 = require('argon2');
const passHashingParamsPromise = import('../src/config/passHashing.js').then(module => module.default);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const passHashingParams = await passHashingParamsPromise;
    await queryInterface.bulkInsert(
      'users',
      [
        {
          cpf: '12345678901',
          fullName: 'Usuário Administrador Inicial',
          email: 'email@emaill.com',
          password: await argon2.hash('123Teste', passHashingParams),
          idUnit: 1,
          accepted: true,
          idRole: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          firstLogin: true,
        },
        {
          cpf: '12345678909',
          fullName: 'Usuário Não Aceito Inicial',
          email: 'email@email.com',
          password: await argon2.hash('123Testen', passHashingParams),
          idUnit: 1,
          accepted: false,
          idRole: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          firstLogin: true,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
