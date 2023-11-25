import UserService from "../../src/services/user";
import models from "../../src/models/_index"

describe('UserServices', () => {

  let userService;
  const userModelMock = {
    count: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(() => {
    userService = new UserService(userModelMock);
  });

  describe('countRows', () => {
    it('deve retornar a quantidade de usuários', async () => {
      const users = [
        { name: 'User 1' },
        { name: 'User 2' },
        { name: 'User 3' },
      ];
      userModelMock.count.mockResolvedValue(users.length);

      const result = await userService.countRows({});

      expect(result).toEqual(users.length);
      expect(userModelMock.count).toHaveBeenCalledWith({});
    });
  });

  describe('getAllUsers', () => {
    it('deve retornar todos os usuários', async () => {
      const users = [
        {
          fullName: 'John Doe',
          idRole: 1,
          accepted: true,
          cpf: '10987654321',
          email: 'john@email.com',
          idUnit: 1,
          password: 'senha',
        },
        {
          fullName: 'John Doe 2',
          idRole: 1,
          accepted: true,
          cpf: '12345678901',
          email: 'john@gmail.com',
          idUnit: 1,
          password: 'senha1',
        },
      ];

      const newUsers = users.map((user) => {
        let newUser = {};
        for (let i in user) {
          i !== 'password' ? newUser[i] = i : {}
        }
        return newUser;
      });

      userModelMock.findAll.mockResolvedValue(newUsers);

      const result = await userService.getAllUsers();

      expect(result).toEqual(newUsers);
      expect(userModelMock.findAll).toHaveBeenCalled();
    });
  });

  describe('getAcceptedUsers', () => {
    it('deve retornar todos usuários aceitados', async () => {
      const users = [
        {
          fullName: 'John Doe',
          idRole: 1,
          accepted: true,
          cpf: '10987654321',
          email: 'john@email.com',
          idUnit: 1,
          password: 'senha',
        },
        {
          fullName: 'John Doe 2',
          idRole: 1,
          accepted: false,
          cpf: '12345678901',
          email: 'john@gmail.com',
          idUnit: 1,
          password: 'senha1',
        },
      ];

      const newUsers = users.map((user) => {
        let newUser = {};
        for (let i in user) {
          i !== 'password' ? newUser[i] = i : {}
        }
        return newUser;
      });

      userModelMock.findAll.mockResolvedValue([newUsers[0]]);

      const result = await userService.getAcceptedUsers();

      expect(result).toEqual([newUsers[0]]);
      expect(userModelMock.findAll).toHaveBeenCalled();
    });
  });

  describe('getNoAcceptedUserByCpf', () => {
    it('deve retornar um usuário não aceito com o cpf especificado', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 1,
        accepted: false,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
        password: 'senha',
      };

      const newUser = {
        fullName: user.fullName,
        idRole: user.idRole,
        accepted: user.accepted,
        cpf: user.cpf,
        email: user.email,
        idUnit: user.idUnit,
      };

      userModelMock.findOne.mockResolvedValue(newUser);

      const result = await userService.getNoAcceptedUserByCpf(user.cpf);

      expect(result).toEqual(newUser);
      expect(userModelMock.findOne).toHaveBeenCalledWith({ 
        where: { accepted: false, cpf: user.cpf },
        attributes: {
          exclude: ['password'],
        },
      });
    });
  });

  describe('getAcceptedUserByCpf', () => {
    it('deve retornar o usuário aceito com o cpf especificado', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 1,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
        password: 'senha',
      };

      const newUser = {
        fullName: user.fullName,
        idRole: user.idRole,
        accepted: user.accepted,
        cpf: user.cpf,
        email: user.email,
        idUnit: user.idUnit,
      };

      userModelMock.findOne.mockResolvedValue(newUser);

      const result = await userService.getAcceptedUserByCpf(user.cpf);

      expect(result).toEqual(newUser);
      expect(userModelMock.findOne).toHaveBeenCalledWith({
        where: { accepted: true, cpf: user.cpf },
        attributes: {
          exclude: ['password'],
        },
      });
    });
  });
});