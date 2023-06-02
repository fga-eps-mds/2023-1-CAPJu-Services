import { UserController } from '../../src/controllers/user.js';
import UserService from '../../src/services/user.js';
import models from '../../src/models/index.js';
import * as jwtUtils from '../../src/utils/jwt.js';

describe('UserController', () => {
  let userController;
  let userServiceMock;
  let reqMock;
  let resMock;

  beforeEach(() => {
    userServiceMock = new UserService(models.User);
    userController = new UserController();
    userController.userService = userServiceMock;
    reqMock = {
      params: {},
      query: {},
      body: {},
    };
    resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getUserByCpf', () => {
    it('should return user if it exists', async () => {
      const userRaw = { id: 1, name: 'John Doe' };
      userServiceMock.getUserByCpf = jest.fn().mockResolvedValue(userRaw);
      reqMock.params.cpf = '1234567890';

      await userController.getUserByCpf(reqMock, resMock);

      expect(userServiceMock.getUserByCpf).toHaveBeenCalledWith('1234567890');
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(userRaw);
    });

    it('should return 404 if user does not exist', async () => {
      userServiceMock.getUserByCpf = jest.fn().mockResolvedValue(null);
      reqMock.params.cpf = '1234567890';

      await userController.getUserByCpf(reqMock, resMock);

      expect(userServiceMock.getUserByCpf).toHaveBeenCalledWith('1234567890');
      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Usuário não existe',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.getUserByCpf = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      reqMock.params.cpf = '1234567890';

      await userController.getUserByCpf(reqMock, resMock);

      expect(userServiceMock.getUserByCpf).toHaveBeenCalledWith('1234567890');
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Erro ao buscar usuário',
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ];
      userServiceMock.getAllUsers = jest.fn().mockResolvedValue(users);

      await userController.getAllUsers(reqMock, resMock);

      expect(userServiceMock.getAllUsers).toHaveBeenCalled();
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(users);
    });

    it('should return accepted users if "accepted" query parameter is true', async () => {
      const users = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ];
      userServiceMock.getAcceptedUsers = jest.fn().mockResolvedValue(users);
      reqMock.query.accepted = 'true';

      await userController.getAllUsers(reqMock, resMock);

      expect(userServiceMock.getAcceptedUsers).toHaveBeenCalled();
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(users);
    });

    it('should return non-accepted users if "accepted" query parameter is false', async () => {
      const users = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ];
      userServiceMock.getNoAcceptedUsers = jest.fn().mockResolvedValue(users);
      reqMock.query.accepted = 'false';

      await userController.getAllUsers(reqMock, resMock);

      expect(userServiceMock.getNoAcceptedUsers).toHaveBeenCalled();
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(users);
    });

    it('should return 400 if "accepted" query parameter is neither true nor false', async () => {
      reqMock.query.accepted = 'invalid';

      await userController.getAllUsers(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({
        message: "Parâmetro accepted deve ser 'true' ou 'false'",
      });
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.getAllUsers = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await userController.getAllUsers(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        message: 'Erro ao listar usuários aceitos ou não',
      });
    });
  });

  describe('loginUser', () => {
    it('should authenticate user with valid credentials', async () => {
      const user = { cpf: '1234567890', password: 'password', accepted: true };
      const token = 'jwt_token';

      userServiceMock.getUserByCpfWithPassword = jest
        .fn()
        .mockResolvedValue(user);
      jwtUtils.generateToken = jest.fn().mockReturnValue(token);

      reqMock.body = user;

      await userController.loginUser(reqMock, resMock);

      expect(userServiceMock.getUserByCpfWithPassword).toHaveBeenCalledWith(
        '1234567890',
      );
      expect(jwtUtils.generateToken).toHaveBeenCalledWith('1234567890');
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        cpf: '1234567890',
        fullName: user.fullName,
        email: user.email,
        idUnit: user.idUnit,
        token,
        idRole: user.idRole,
        expiresIn: expect.any(Date),
      });
    });

    it('should return 401 if user does not exist', async () => {
      userServiceMock.getUserByCpfWithPassword = jest
        .fn()
        .mockResolvedValue(null);

      reqMock.body = { cpf: '1234567890', password: 'password' };

      await userController.loginUser(reqMock, resMock);

      expect(userServiceMock.getUserByCpfWithPassword).toHaveBeenCalledWith(
        '1234567890',
      );
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Usuário inexistente',
        message: 'Usuário inexistente',
      });
    });

    it('should return 401 if user is not accepted', async () => {
      const user = { cpf: '1234567890', password: 'password', accepted: false };

      userServiceMock.getUserByCpfWithPassword = jest
        .fn()
        .mockResolvedValue(user);

      reqMock.body = { cpf: '1234567890', password: 'password' };

      await userController.loginUser(reqMock, resMock);

      expect(userServiceMock.getUserByCpfWithPassword).toHaveBeenCalledWith(
        '1234567890',
      );
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Usuário não aceito',
      });
    });

    it('should return 401 if password is incorrect', async () => {
      const user = { cpf: '1234567890', password: 'password', accepted: true };

      userServiceMock.getUserByCpfWithPassword = jest
        .fn()
        .mockResolvedValue(user);

      reqMock.body = { cpf: '1234567890', password: 'wrong_password' };

      await userController.loginUser(reqMock, resMock);

      expect(userServiceMock.getUserByCpfWithPassword).toHaveBeenCalledWith(
        '1234567890',
      );
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Impossível autenticar',
        message: 'Senha ou usuário incorretos',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.getUserByCpfWithPassword = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await userController.loginUser(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        message: 'erro inesperado',
      });
    });
  });

  describe('store', () => {
    it('should create a new user', async () => {
      const newUser = {
        fullName: 'John Doe',
        cpf: '1234567890',
        email: 'john@example.com',
        password: 'password',
        idUnit: 1,
        idRole: 2,
      };
      const createdUser = {
        id: 1,
        fullName: 'John Doe',
        cpf: '1234567890',
        email: 'john@example.com',
        accepted: false,
        idUnit: 1,
        idRole: 2,
      };

      userServiceMock.createUser = jest.fn().mockResolvedValue(createdUser);

      reqMock.body = newUser;

      await userController.store(reqMock, resMock);

      expect(userServiceMock.createUser).toHaveBeenCalledWith({
        fullName: 'John Doe',
        cpf: '1234567890',
        email: 'john@example.com',
        password: 'password',
        accepted: false,
        idUnit: 1,
        idRole: 2,
      });
      expect(resMock.json).toHaveBeenCalledWith(createdUser);
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.createUser = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await userController.store(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        message: 'Erro ao criar usuário',
      });
    });
  });

  describe('deleteByCpf', () => {
    it('should delete an existing user by CPF', async () => {
      const user = { cpf: '1234567890', destroy: jest.fn() };

      userServiceMock.getAcceptedUserByCpf = jest.fn().mockResolvedValue(user);

      reqMock.params.cpf = '1234567890';

      await userController.deleteByCpf(reqMock, resMock);

      expect(userServiceMock.getAcceptedUserByCpf).toHaveBeenCalledWith('1234567890');
      expect(user.destroy).toHaveBeenCalled();
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Usuário apagado com sucesso',
      });
    });

    it('should return 404 if user does not exist', async () => {
      userServiceMock.getAcceptedUserByCpf = jest.fn().mockResolvedValue(null);

      reqMock.params.cpf = '1234567890';

      await userController.deleteByCpf(reqMock, resMock);

      expect(userServiceMock.getAcceptedUserByCpf).toHaveBeenCalledWith('1234567890');
      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Usuário não existe!',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.getAcceptedUserByCpf = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      reqMock.params.cpf = '1234567890';

      await userController.deleteByCpf(reqMock, resMock);

      expect(userServiceMock.getAcceptedUserByCpf).toHaveBeenCalledWith('1234567890');
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        message: 'Erro ao apagar usuário',
      });
    });
  });
});
