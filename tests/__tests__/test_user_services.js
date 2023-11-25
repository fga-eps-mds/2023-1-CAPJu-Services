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
});