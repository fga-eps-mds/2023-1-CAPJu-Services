import { generateToken, jwtToken } from '../../src/utils/jwt.js';
import { tokenToUser } from '../../middleware/authMiddleware';
import UserService from '../../src/services/user.js';
import models from '../../src/models/_index.js';
import jwt from 'jsonwebtoken';
import sequelizeConfig from '../../src/config/sequelize';
import {
  authenticate,
  userFromReq,
} from '../../src/middleware/authMiddleware.js';
//import "dotenv/config.js"

jest.mock('jsonwebtoken');

describe('authMiddleware test', () => {
  beforeEach(() => {
    let userServiceMock = new UserService(models.User);
    let reqMock = {
      params: {},
      query: {},
      body: {},
      headers: {},
    };
    let resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('authenticate', () => {
    // it('should return 401 if user is not found', async () => {
    // });

    it('should return 401 if no token is provided', async () => {
      const req = {
        headers: {},
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authenticate(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    });

    // it('should return 401 for token expiration', async () => {
    // });

    it('should return 401 for 2° authentication failure', async () => {
      const req = {
        headers: {
          authorization: 'Bearer aossodaijsioja',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Authentication failed');
      });

      await authenticate(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Authentication failed',
      });

      jest.spyOn(jwt, 'verify').mockRestore();
    });
  });

  describe('userFromReq', () => {
    it('should return user ID from token', async () => {
      const req = {
        headers: {
          authorization: 'Bearer sdawdsawd',
        },
      };

      const decodeSpy = jest
        .spyOn(jwt, 'decode')
        .mockReturnValue({ id: 'user_id' });

      const teste = await userFromReq(req);

      expect(decodeSpy).toHaveBeenCalledWith('sdawdsawd');

      expect(teste).toEqual('user_id');

      decodeSpy.mockRestore();
    });
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
