import { generateToken, jwtToken } from '../../src/utils/jwt.js';
import { tokenToUser } from '../../middleware/authMiddleware';
import UserService from '../../src/services/user.js';
import models from '../../src/models/_index.js';
import jwt from 'jsonwebtoken';
import sequelizeConfig from '../../src/config/sequelize';
//import "dotenv/config.js"

describe('authMiddleware test', () => {
  beforeEach(() => {
    let userServiceMock = new UserService(models.User);
    let reqMock = {
      params: {},
      query: {},
      body: {},
    };
    let resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('test of tokenToUser', () => {
    it('valid token', async () => {
      let userServiceMock = new UserService(models.User);
      const createUser = {
        fullName: 'John Doe',
        idRole: 1,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
        password: 'senha',
      };
      const token = generateToken(createUser.cpf);
      let req = { headers: {} };
      let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      userServiceMock.createUser = jest.fn().mockResolvedValue(createUser);
      req.headers.authorization = 'Bearer ' + token;
      const teste = await tokenToUser(req, res);
      expect(teste.cpf).toBe(undefined);
    });

    it('without token', async () => {
      let req;
      let res = { status: true };
      req = { headers: {} };
      const teste = await tokenToUser(req, res);
      expect(res.status).toBe(true);
    });

    it('user was not accepted', async () => {
      let req = {
        headers: {
          authorization: 'Bearer jwtblabla',
        },
      };

      jest
        .spyOn(jwt, 'verify')
        .mockImplementation(() => ({ id: 'fakeUserId' }));

      jest
        .spyOn(sequelizeConfig, 'query')
        .mockResolvedValue([{ accepted: false }]);

      let resMock = {
        status: jest.fn().mockReturnThis(),
      };

      const result = await tokenToUser(req, resMock);
      expect(resMock.status).toHaveBeenCalledWith(401);
    });

    it('user was accepted', async () => {
      let req = {
        headers: {
          authorization: 'Bearer jwtblabla',
        },
      };

      jest
        .spyOn(jwt, 'verify')
        .mockImplementation(() => ({ id: 'fakeUserId' }));

      jest
        .spyOn(sequelizeConfig, 'query')
        .mockResolvedValue([{ accepted: true }]);

      let resMock = {
        status: jest.fn().mockReturnThis(),
      };

      const result = await tokenToUser(req, resMock);
      expect(result).toEqual({ accepted: true });
    });
  });

  describe('test jwtToken', () => {
    const env = process.env;

    it('should use process.env.JWT_SECRET if available', () => {
      jest.resetModules();
      process.env = { JWT_SECRET: 'mockedSecret' };

      const { jwtToken: modifiedJwtToken } = require('../../src/utils/jwt.js');

      expect(modifiedJwtToken).toBe('mockedSecret');
    });

    it('should use default value "ABC" if process.env.JWT_SECRET is not available', () => {
      jest.resetModules();
      process.env = { JWT_SECRET: undefined };

      const { jwtToken: modifiedJwtToken } = require('../../src/utils/jwt.js');

      expect(modifiedJwtToken).toBe('ABC');
    });

    process.env = env;
  });
});
