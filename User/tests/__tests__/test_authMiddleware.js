import { generateToken } from '../../src/utils/jwt.js';
import { tokenToUser } from '../../middleware/authMiddleware';
import UserService from '../../src/services/user.js';
import models from '../../src/models/_index.js';


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
      console.log(teste);
      expect(teste.cpf).toBe(undefined);
    });

    it('without token', async () => {
      let req;
      let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      req = { headers: { authorization: 'Bearer ' } };
      const teste = await tokenToUser(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
