import UserService from '../../src/services/user';
import models from '../../src/models/_index';
import argon2 from 'argon2';

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

      const newUsers = users.map(user => {
        let newUser = {};
        for (let i in user) {
          i !== 'password' ? (newUser[i] = i) : {};
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
      const dataMock = {
        where: { accepted: true },
        offset: 0,
        limit: 5,
      };

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

      const newUsers = users.map(user => {
        let newUser = {};
        for (let i in user) {
          i !== 'password' ? (newUser[i] = i) : {};
        }
        return newUser;
      });

      userModelMock.findAll.mockResolvedValue([newUsers[0]]);

      const result = await userService.getAcceptedUsers(dataMock);

      expect(result).toEqual([newUsers[0]]);
      expect(userModelMock.findAll).toHaveBeenCalledWith({
        where: { ...dataMock.where, accepted: true },
        offset: dataMock.offset,
        limit: dataMock.limit,
        attributes: {
          exclude: ['password'],
        },
      });
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

  describe('getAcceptedUserByUnitAndCpf', () => {
    it('deve retornar o usuário aceito com a unidade e o cpf especificados', async () => {
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

      const result = await userService.getAcceptedUserByUnitAndCpf(
        user.idUnit,
        user.cpf,
      );

      expect(result).toEqual(newUser);
      expect(userModelMock.findOne).toHaveBeenCalledWith({
        where: { accepted: true, idUnit: user.idUnit, cpf: user.cpf },
        attributes: {
          exclude: ['password'],
        },
      });
    });
  });

  describe('getNoAcceptedUsers', () => {
    it('deve retornar todos usuários não aceitos', async () => {
      const dataMock = {
        where: { accepted: false },
        offset: 0,
        limit: 5,
      };

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

      const newUsers = users.map(user => {
        let newUser = {};
        for (let i in user) {
          i !== 'password' ? (newUser[i] = i) : {};
        }
        return newUser;
      });

      userModelMock.findAll.mockResolvedValue([newUsers[0]]);

      const result = await userService.getNoAcceptedUsers(dataMock);

      expect(result).toEqual([newUsers[0]]);
      expect(userModelMock.findAll).toHaveBeenCalledWith({
        where: { ...dataMock.where, accepted: false },
        offset: dataMock.offset,
        limit: dataMock.limit,
        attributes: {
          exclude: ['password'],
        },
      });
    });
  });

  describe('getUserByCpf', () => {
    it('deve retornar o usuário com o cpf especificado', async () => {
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

      const result = await userService.getUserByCpf(user.cpf);

      expect(result).toEqual(newUser);
      expect(userModelMock.findOne).toHaveBeenCalledWith({
        where: { cpf: user.cpf },
        attributes: {
          exclude: ['password'],
        },
      });
    });
  });

  describe('getUsersAdminByIdUnit', () => {
    it('deve retornar usuários administrativos com a unidade especificada', async () => {
      const users = [
        {
          fullName: 'John Doe',
          idRole: 5,
          accepted: true,
          cpf: '10987654321',
          email: 'john@email.com',
          idUnit: 1,
          password: 'senha',
        },
      ];

      userModelMock.findAll.mockResolvedValue(users);

      const result = await userService.getUsersAdminByIdUnit(users[0].idUnit);

      expect(result).toEqual(users);
      expect(userModelMock.findAll).toHaveBeenCalledWith({
        where: {
          idUnit: users[0].idUnit,
          idRole: 5,
        },
      });
    });
  });

  describe('getUserByUnit', () => {
    it('deve retornar o usuário com o cpf e a unidade especificada', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 5,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
        password: 'senha',
      };

      userModelMock.findOne.mockResolvedValue(user);

      const result = await userService.getUserByUnit(user.cpf, user.idUnit);

      expect(result).toEqual(user);
      expect(userModelMock.findOne).toHaveBeenCalledWith({
        where: {
          cpf: user.cpf,
          idUnit: user.idUnit,
        },
      });
    });
  });

  describe('getUserByCpfWithPassword', () => {
    it('deve retornar o usuário com o cpf especificado e mostrando a senha dele', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 5,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
        password: 'senha',
      };

      userModelMock.findOne.mockResolvedValue(user);

      const result = await userService.getUserByCpfWithPassword(user.cpf);

      expect(result).toEqual(user);
      expect(userModelMock.findOne).toHaveBeenCalledWith({
        where: { cpf: user.cpf },
      });
    });
  });

  describe('createUser', () => {
    it('deve retornar um usuário criado', async () => {
      const createUser = {
        fullName: 'John Doe',
        idRole: 5,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
        password: 'senha',
      };

      userModelMock.create.mockResolvedValue(createUser);

      const result = await userService.createUser(createUser);

      expect(result).toEqual(createUser);
      expect(userModelMock.create).toHaveBeenCalled();
    });
  });

  describe('updateUserEmail', () => {
    it('deve retornar verdadeiro por conseguir atualizar', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 5,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
      };

      userModelMock.findOne.mockResolvedValue(user);
      userModelMock.update.mockResolvedValue([1]);

      const result = await userService.updateUserEmail(
        user.cpf,
        'johnDoe@email.com',
      );

      expect(result).toEqual(true);
      expect(userModelMock.findOne).toHaveBeenCalledWith({
        where: { cpf: user.cpf },
        attributes: {
          exclude: ['password'],
        },
      });
      expect(userModelMock.update).toHaveBeenCalledWith(
        { email: 'johnDoe@email.com' },
        { where: { cpf: user.cpf } },
      );
    });

    it('deve retornar falso por não achar o usuário', async () => {
      userModelMock.findOne.mockResolvedValue();

      const result = await userService.updateUserEmail('12345678901', '');

      expect(result).toEqual(false);
      expect(userModelMock.findOne).toHaveBeenCalled();
    });

    it('deve retornar falso por não conseguir atualizar o usuário', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 5,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
      };

      userModelMock.findOne.mockResolvedValue(user);
      userModelMock.update.mockResolvedValue([]);

      const result = await userService.updateUserEmail(
        user.cpf,
        'johnDoe@email.com',
      );

      expect(result).toEqual(false);
      expect(userModelMock.findOne).toHaveBeenCalledWith({
        where: { cpf: user.cpf },
        attributes: {
          exclude: ['password'],
        },
      });
      expect(userModelMock.update).toHaveBeenCalled();
    });
  });

  describe('updateUserRole', () => {
    it('deve retornar verdadeiro por conseguir atualizar', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 5,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
      };

      userModelMock.findOne.mockResolvedValue(user);
      userModelMock.update.mockResolvedValue([1]);

      const result = await userService.updateUserRole(user.cpf, 1);

      expect(result).toEqual(true);
      expect(userModelMock.findOne).toHaveBeenCalledWith({
        where: { cpf: user.cpf },
        attributes: {
          exclude: ['password'],
        },
      });
      expect(userModelMock.update).toHaveBeenCalledWith(
        { idRole: 1 },
        { where: { cpf: user.cpf } },
      );
    });

    it('deve retornar falso por não achar o usuário', async () => {
      userModelMock.findOne.mockResolvedValue();

      const result = await userService.updateUserRole('12345678901', '');

      expect(result).toEqual(false);
      expect(userModelMock.findOne).toHaveBeenCalled();
    });

    it('deve retornar falso por não conseguir atualizar o usuário', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 5,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
      };

      userModelMock.findOne.mockResolvedValue(user);
      userModelMock.update.mockResolvedValue([]);

      const result = await userService.updateUserRole(user.cpf, 1);

      expect(result).toEqual(false);
      expect(userModelMock.findOne).toHaveBeenCalledWith({
        where: { cpf: user.cpf },
        attributes: {
          exclude: ['password'],
        },
      });
      expect(userModelMock.update).toHaveBeenCalled();
    });
  });

  describe('updateUserFullName', () => {
    it('deve retornar verdadeiro por conseguir atualizar', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 5,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$ckziFVvRPlW3vMrcLoe69w$B2U+JH5gLgEEoI8s6ehKyxkW0OvtP4eSVWwx2Q3eOvgIqF9mCUO25SSwQ10HaYhINn8',
      };

      userService.getUserByCpf = jest.fn().mockResolvedValue(user);
      userModelMock.update.mockResolvedValue([1]);

      const result = await userService.updateUserFullName(user.cpf, 'John Han');

      expect(result).toEqual(true);
    });

    it('deve retornar falso por não conseguir achar o usuário', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 5,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$ckziFVvRPlW3vMrcLoe69w$B2U+JH5gLgEEoI8s6ehKyxkW0OvtP4eSVWwx2Q3eOvgIqF9mCUO25SSwQ10HaYhINn8',
      };
      userService.getUserByCpf = jest.fn().mockResolvedValue(null);

      const result = await userService.updateUserFullName(user.cpf, 'John Han');

      expect(result).toEqual(false);
      expect(userService.getUserByCpf).toHaveBeenCalledWith('10987654321');
    });

    it('deve retornar falso por não conseguir atualizar', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 5,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$ckziFVvRPlW3vMrcLoe69w$B2U+JH5gLgEEoI8s6ehKyxkW0OvtP4eSVWwx2Q3eOvgIqF9mCUO25SSwQ10HaYhINn8',
      };

      userService.getUserByCpf = jest.fn().mockResolvedValue(user);
      userModelMock.update.mockResolvedValue([0]);

      const result = await userService.updateUserFullName(user.cpf, 'Jonh Han');

      expect(result).toEqual(false);
      expect(userService.getUserByCpf).toHaveBeenCalledWith(user.cpf);
    });
  });

  describe('updateUserPassword', () => {
    it('deve retornar verdadeiro por conseguir atualizar', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 5,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$ckziFVvRPlW3vMrcLoe69w$B2U+JH5gLgEEoI8s6ehKyxkW0OvtP4eSVWwx2Q3eOvgIqF9mCUO25SSwQ10HaYhINn8',
      };

      userService.getUserByCpfWithPassword = jest.fn().mockResolvedValue(user);
      jest
        .spyOn(argon2, 'hash')
        .mockResolvedValue(
          '$argon2id$v=19$m=65536,t=3,p=4$ckziFVvRPlW3vMrcLoe69w$B2U+JH5gLgEEoI8s6ehKyxkW0OvtP4eSVWwx2Q3eOvgIwF9mCUO25SSwQ10HaYhINn8',
        );
      userModelMock.update.mockResolvedValue([1]);

      const result = await userService.updateUserPassword(
        user.cpf,
        '123Teste',
        '123Teste',
      );

      expect(result).toEqual(true);
      expect(userService.getUserByCpfWithPassword).toHaveBeenCalledWith(
        user.cpf,
      );
    });

    it('deve retornar falso por não conseguir achar o usuário', async () => {
      userService.getUserByCpfWithPassword = jest.fn().mockResolvedValue(null);

      const result = await userService.updateUserPassword(
        '12345678901',
        'umaOutraQualquerParaDarErro',
        'outraSenha',
      );

      expect(result).toEqual(false);
      expect(userService.getUserByCpfWithPassword).toHaveBeenCalledWith(
        '12345678901',
      );
    });

    it('deve retornar falso por não receber a senha antiga correta', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 5,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$ckziFVvRPlW3vMrcLoe69w$B2U+JH5gLgEEoI8s6ehKyxkW0OvtP4eSVWwx2Q3eOvgIqF9mCUO25SSwQ10HaYhINn8',
      };

      userModelMock.findOne.mockResolvedValue(user);

      const result = await userService.updateUserPassword(
        user.cpf,
        'umaOutraQualquerParaDarErro',
        'outraSenha',
      );

      expect(result).toEqual(false);
      expect(userModelMock.findOne).toHaveBeenCalledWith({
        where: { cpf: user.cpf },
      });
    });

    it('deve retornar falso por não conseguir atualizar o usuário', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 5,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$ckziFVvRPlW3vMrcLoe69w$B2U+JH5gLgEEoI8s6ehKyxkW0OvtP4eSVWwx2Q3eOvgIqF9mCUO25SSwQ10HaYhINn8',
      };

      userService.getUserByCpfWithPassword = jest.fn().mockResolvedValue(user);
      jest
        .spyOn(argon2, 'hash')
        .mockResolvedValue(
          '$argon2id$v=19$m=65536,t=3,p=4$ckziFVvRPlW3vMrcLoe69w$B2U+JH5gLgEEoI8s6ehKyxkW0OvtP4eSVWwx2Q3eOvgIwF9mCUO25SSwQ10HaYhINn8',
        );
      userModelMock.update.mockResolvedValue([0]);

      const result = await userService.updateUserPassword(
        user.cpf,
        '123TestErrado',
        'novaSenha',
      );

      expect(result).toEqual(false);
      expect(userService.getUserByCpfWithPassword).toHaveBeenCalledWith(
        user.cpf,
      );
    });
  });

  describe('getUserByCpfWithPasswordRolesAndUnit', () => {
    it('deve retornar usuario', async () => {
      const user = {
        fullName: 'John Doe',
        idRole: 5,
        accepted: true,
        cpf: '10987654321',
        email: 'john@email.com',
        idUnit: 1,
        password: 'asdvljhbjljabvsdkadfvj',
      };

      userModelMock.findOne.mockResolvedValue(user);
      const result = await userService.getUserByCpfWithPasswordRolesAndUnit(
        user.cpf,
      );

      expect(result).toBe(user);
    });
  });
});
