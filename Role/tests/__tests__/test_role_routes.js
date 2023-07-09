import { RoleController } from '../../src/controllers/role.js';

jest.mock('axios');

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("role endpoints", () => {
  let roleController;

  beforeEach(() => {
    roleController = new RoleController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("index - list all roles (200)", async () => {
    roleController.roleService.findAll = jest.fn().mockResolvedValue([]);

    await roleController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith([]);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("index - return message (204)", async () => {
    roleController.roleService.findAll = jest.fn().mockResolvedValue(false);

    await roleController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({ message: "Não Existe cargo" });
    expect(resMock.status).toHaveBeenCalledWith(204);
  });

  test("index - internal server error (500)", async () => {
    const error = new Error("Internal Server Error");
    roleController.roleService.findAll = jest.fn().mockRejectedValue(error);

    await roleController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(error);
    expect(resMock.status).toHaveBeenCalledWith(500);
  });
  
  test("getById - return message (204)", async () => {
    roleController.roleService.findOneById = jest.fn().mockResolvedValue(false);

    reqMock.params = { id: 1 };
    await roleController.getById(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith([]);
    expect(resMock.status).toHaveBeenCalledWith(204);
  });

  test("getById - return message (200)", async () => {
    const role = {
      idRole: 1,
      name: "juiz",
      accessLevel: 1,
      allowedActions: [],
    };

    reqMock.params = { id: role.idRole };
    roleController.roleService.findOneById = jest.fn().mockResolvedValue(role);

    await roleController.getById(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(role);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("getById - internal server error (500)", async () => {
    const error = new Error("Internal Server Error");

    reqMock.params = { id: 1 };
    roleController.roleService.findOneById = jest.fn().mockRejectedValue(error);

    await roleController.getById(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(error);
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test("updateRoleName - return empty role (204)", async () => {
    reqMock.body = {
      idRole: 1,
      name: "juiz",
    };
    roleController.roleService.findOneById = jest.fn().mockResolvedValue(false);
    roleController.roleService.updateRoleName = jest.fn().mockResolvedValue();

    await roleController.updateRoleName(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith([]);
    expect(resMock.status).toHaveBeenCalledWith(204);
  });

  test("updateRoleName - return updated role (200)", async () => {
    const role = {
      idRole: 1,
      name: "juiz",
      accessLevel: 1,
      allowedActions: [],
      set: jest.fn(),
      save: jest.fn(),
    };

    reqMock.body = {
      idRole: role.idRole,
      name: role.name,
    };
    roleController.roleService.findOneById = jest.fn().mockResolvedValue(role);
    roleController.roleService.updateRoleName = jest.fn().mockResolvedValue();

    await roleController.updateRoleName(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(role);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("updateRoleName - internal server error (500)", async () => {
    const error = new Error("Internal Server Error");

    reqMock.params = { idRole: 1 };
    roleController.roleService.findOneById = jest.fn().mockRejectedValue(error);

    await roleController.updateRoleName(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(error);
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test("updateRoleAllowedActions - internal server error (500)", async () => {
    const error = new Error("Internal Server Error");

    reqMock.params = { idRole: 1 };
    roleController.roleService.findOneById = jest.fn().mockRejectedValue(error);

    await roleController.updateRoleAllowedActions(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(error);
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test("updateRoleAllowedActions - return empty role ([])", async () => {
    reqMock.params = { idRole: 1 };
    reqMock.body = { allowedActions: [] };
    roleController.roleService.findOneById = jest.fn().mockResolvedValue(false);
    roleController.roleService.updateRoleName = jest.fn().mockResolvedValue();

    await roleController.updateRoleAllowedActions(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith([]);
    expect(resMock.status).toHaveBeenCalledWith(204);
  });

  test("updateRoleAllowedActions - return updated role (200)", async () => {
    const role = {
      idRole: 1,
      name: "juiz",
      accessLevel: 1,
      allowedActions: [],
      set: jest.fn(),
      save: jest.fn(),
    };

    reqMock.params = { idRole: role.idRole };
    reqMock.body = { allowedActions: role.allowedActions };
    roleController.roleService.findOneById = jest.fn().mockResolvedValue(role);
    roleController.roleService.updateRoleName = jest.fn().mockResolvedValue();

    await roleController.updateRoleAllowedActions(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(role);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("delete - return not found (404)", async () => {
    reqMock.body = { idRole: 1 };
    roleController.roleService.findOneById = jest.fn().mockResolvedValue(false);

    await roleController.delete(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(404);
  });

  test("delete - return destroyed role (200)", async () => {
    const role = {
      idRole: 1,
      name: "juiz",
      accessLevel: 1,
      allowedActions: [],
      destroy: jest.fn(),
    };
    reqMock.body = { idRole: 1 };
    roleController.roleService.findOneById = jest.fn().mockResolvedValue(role);
    roleController.roleService.deleteNoteById = jest.fn().mockResolvedValue();

    await roleController.delete(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(role);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("delete - internal server error (500)", async () => {
    const error = new Error("Internal Server Error");

    reqMock.body = { idRole: 1 };
    roleController.roleService.findOneById = jest.fn().mockRejectedValue(error);

    await roleController.delete(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(error);
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test("store - create Role (200)", async () => {
    const role = {
      idRole: 1,
      name: "juiz",
      accessLevel: 1,
      allowedActions: [],
    };
    reqMock.body = role;
    roleController.roleService.createRole = jest.fn().mockResolvedValue(role);

    await roleController.store(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(role);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("store - internal server error (500)", async () => {
    const error = new Error("Internal Server Error");
    roleController.roleService.createRole = jest.fn().mockRejectedValue(error);

    await roleController.store(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(error);
    expect(resMock.status).toHaveBeenCalledWith(500);
  });
});
