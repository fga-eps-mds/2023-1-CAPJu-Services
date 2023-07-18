import { generateToken } from '../../src/utils/jwt.js';
import { tokenToUser } from '../../middleware/authMiddleware';
import UserService from '../../src/services/user.js';
import models from '../../src/models/_index.js';

describe('authMiddleware test', () => {
  test('valid token', async () => {
    const mockuser = {
      fullName: 'John Doe',
      idRole: 1,
      accepted: true,
      cpf: '10987654321',
      email: 'john@email.com',
      idUnit: 1,
      password: 'senha',
    };
    const token = generateToken(mockuser.cpf);
    const userServiceMock = new UserService(models.User);
    if (
      !userServiceMock.user.findOne({
        where: { cpf: mockuser.cpf },
      })
    )
      userServiceMock.createUser(mockuser);

    let req = { headers: {} };
    let res;
    req.headers.authorization = 'Bearer ' + token;
    const teste = await tokenToUser(req, res);
    expect(teste.cpf).toBe(mockuser.cpf);
  });

  test('without token', async () => {
    let req;
    let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    req = { headers: { authorization: 'Bearer ' } };
    const teste = await tokenToUser(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
