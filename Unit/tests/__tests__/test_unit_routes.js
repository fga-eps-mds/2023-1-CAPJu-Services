import controllers from "../../src/controllers/_index.js";
import services from "../../src/services/_index.js";
import axios from "axios";

jest.mock("axios");

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("unit endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("index - list all units (200)", async () => {
    services.unitService.getAllUnits = jest.fn().mockResolvedValue([]);
    services.unitService.countRows = jest.fn().mockResolvedValue(0);

    reqMock.query = {
      limit: 1,
      offset: 0,
      filter: 0,
    };
    await controllers.unitController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({ units: [], totalPages: 0 });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("index - failed to list (500)", async () => {
    const error = new Error("Internal Error");
    services.unitService.getAllUnits = jest.fn().mockRejectedValue(error);
    await controllers.unitController.index(reqMock, resMock);
    expect(resMock.json).toHaveBeenCalledWith({
      error,
      message: "Erro ao listar unidades",
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test("store - create unit (200)", async () => {
    const newUnit = {
      idUnit: 1,
      name: "New unit",
    };
    services.unitService.createUnit = jest.fn().mockResolvedValue(newUnit);

    reqMock.body = newUnit.name;
    await controllers.unitController.store(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(newUnit);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("store - failed to create unit (500)", async () => {
    const error = new Error("Internal Error");
    services.unitService.createUnit = jest.fn().mockRejectedValue(error);

    reqMock.body = { name: "Unidade" };
    await controllers.unitController.store(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error,
      message: "Erro ao criar unidade",
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test("update - set new name (200)", async () => {
    services.unitService.updateUnit = jest.fn().mockResolvedValue(true);

    reqMock.body = {
      idUnit: 1,
      name: "Unidade",
    };
    await controllers.unitController.update(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({ message: 'Unidade atualizado com sucesso' });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("update - failed to update unit (404)", async () => {
    services.unitService.updateUnit = jest.fn().mockResolvedValue(false);

    reqMock.body = {
      idUnit: 1,
      name: "Unidade",
    };
    await controllers.unitController.update(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: "Essa unidade não existe!",
    });
    expect(resMock.status).toHaveBeenCalledWith(404);
  });

  test("update - failed to update unit (500)", async () => {
    const error = new Error("Internal Error");
    services.unitService.updateUnit = jest.fn().mockRejectedValue(error);

    await controllers.unitController.update(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error,
      message: 'Erro ao atualizar unidade',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test("delete - unit removed (200)", async () => {
    const unit = {
      idUnit: 1,
      name: "New unit",
      destroy: jest.fn(),
    };
    services.unitService.getAllUnits = jest.fn().mockResolvedValue([]);
    services.unitService.getUnitById = jest.fn().mockResolvedValue(unit);

    const users_response =
    {
      data: []
    }
    axios.get.mockResolvedValueOnce(users_response);

    reqMock.body = { idUnit: unit.idUnit };
    await controllers.unitController.delete(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({ message: 'Unidade apagada com sucesso', });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("delete - unit does not exist (204)", async () => {
    services.unitService.getAllUnits = jest.fn().mockResolvedValue([]);
    services.unitService.getUnitById = jest.fn().mockResolvedValue(false);

    reqMock.body = { idUnit: 1 };
    await controllers.unitController.delete(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error: "Essa unidade não existe!",
    });
    expect(resMock.status).toHaveBeenCalledWith(204);
  });

  test("delete - unit has users (409)", async () => {
    const testUser = {
      fullName: "nome",
      cpf: "12345678912",
      email: "aa@bb.com",
      password: "pw123456",
      idUnit: 1,
      idRole: 3,
    };

    services.unitService.getUnitById = jest.fn().mockResolvedValue(testUser);
    const users_response =
    {
      data: [{
        cpf: '12345678901',
        fullName: 'Usuário Administrador Inicial',
        email: 'email@emaill.com',
        password: '123Teste',
        accepted: true,
        idUnit: 1,
        idRole: 5,
      }]
    }
    axios.get.mockResolvedValueOnce(users_response);
    reqMock.body = { idUnit: 1 };
    await controllers.unitController.delete(reqMock, resMock);
    expect(resMock.json).toHaveBeenCalledWith({
      error: "Há usuários na unidade",
      message: `Há 1 usuários nesta unidade.`,
    });
    expect(resMock.status).toHaveBeenCalledWith(409);
  });

  test("delete - failed to delete unit (500)", async () => {
    const error = new Error("Internal Error");
    services.unitService.getUnitById = jest.fn().mockRejectedValue(error);

    await controllers.unitController.delete(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error,
      message: 'Erro ao apagar unidade',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test("showAdminsByUnitId - there are admins (200)", async () => {
    const users_response =
    {
      data: [{
        cpf: '12345678901',
        fullName: 'Usuário Administrador Inicial',
        email: 'email@emaill.com',
        password: '123Teste',
        accepted: true,
        idUnit: 1,
        idRole: 5,
      }]
    }
    axios.get.mockResolvedValueOnce(users_response);

    reqMock.params = { id: 1 };
    await controllers.unitController.showAdminsByUnitId(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(users_response.data);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("showAdminsByUnitId - there are no admins (204)", async () => {
    const users_response =
    {
      data: []
    }
    axios.get.mockResolvedValueOnce(users_response);

    reqMock.params = { id: 1 };
    await controllers.unitController.showAdminsByUnitId(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error: "Não há administradores para essa unidade",
    });
    expect(resMock.status).toHaveBeenCalledWith(204);
  });

  test("showAdminsByUnitId - Failed to show units admin (500)", async () => {
    const error = new Error("Internal Error");
    services.unitService.getUnitById = jest.fn().mockRejectedValue(error);

    await controllers.unitController.showAdminsByUnitId(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error: 'Erro ao buscar administradores',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test("setUnitAdmin - Set accepted user as admin (200)", async () => {
    const userAdmin =
    {
      data: {
        cpf: '12345678901',
        fullName: 'Usuário Administrador Inicial',
        email: 'email@emaill.com',
        password: '123Teste',
        accepted: true,
        idUnit: 1,
        idRole: 5,
      }
    }
    axios.get.mockResolvedValueOnce(userAdmin);
    const userUpdated =
    {
      data: {
        cpf: '12345678901',
        fullName: 'Usuário Administrador Inicial',
        email: 'email@emaill.com',
        password: '123Teste',
        accepted: true,
        idUnit: 1,
        idRole: 5,
      }
    }
    axios.get.mockResolvedValueOnce(userUpdated);
    reqMock.body = {
      idUnit: userAdmin.data.idUnit,
      cpf: userAdmin.data.cpf,
    };
    await controllers.unitController.setUnitAdmin(reqMock, resMock);
    expect(resMock.json).toHaveBeenCalledWith({
      cpf: '12345678901',
      fullName: 'Usuário Administrador Inicial',
      email: 'email@emaill.com',
      password: '123Teste',
      accepted: true,
      idUnit: 1,
      idRole: 5,
    });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("setUnitAdmin - There are no accepted users for the unit (404)", async () => {
    const userAdmin = {}
    axios.get.mockResolvedValueOnce(userAdmin);

    reqMock.body = {
      idUnit: 1,
      cpf: "12345678912",
    };
    await controllers.unitController.setUnitAdmin(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: "Usuário aceito não existe nesta unidade",
    });
    expect(resMock.status).toHaveBeenCalledWith(404);
  });

  test("setUnitAdmin - Failed to set new admin (500)", async () => {
    const error = new Error("Internal Error");
    services.unitService.getUnitById = jest.fn().mockRejectedValue(error);

    await controllers.unitController.setUnitAdmin(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Erro ao configurar usuário como administrador',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test("removeUnitAdmin - user not found (404)", async () => {
    const userAdmin =
    {

    }
    axios.get.mockResolvedValueOnce(userAdmin);

    const userUpdated =
    {
      data: {
        cpf: '12345678901',
        fullName: 'Usuário Administrador Inicial',
        email: 'email@emaill.com',
        password: '123Teste',
        accepted: true,
        idUnit: 1,
        idRole: 5,
      }
    }
    axios.get.mockResolvedValueOnce(userUpdated);

    reqMock.body = {
      idUnit: 1,
      cpf: "12345678912",
    };
    await controllers.unitController.removeUnitAdmin(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error: "Usuário não existe nesta unidade",
    });
    expect(resMock.status).toHaveBeenCalledWith(404);
  });

  test("removeUnitAdmin - user removed (200)", async () => {
    const userAdmin =
    {
      data: {
        cpf: '12345678901',
        fullName: 'Usuário Administrador Inicial',
        email: 'email@emaill.com',
        password: '123Teste',
        accepted: true,
        idUnit: 1,
        idRole: 5,
      }
    }
    axios.get.mockResolvedValueOnce(userAdmin);

    const userUpdated =
    {
      data: {
        cpf: '12345678901',
        fullName: 'Usuário Administrador Inicial',
        email: 'email@emaill.com',
        password: '123Teste',
        accepted: true,
        idUnit: 1,
        idRole: 5,
      }
    }
    axios.get.mockResolvedValueOnce(userUpdated);

    reqMock.body = {
      idUnit: userAdmin.data.idUnit,
      cpf: userAdmin.data.cpf,
    };
    await controllers.unitController.removeUnitAdmin(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(userUpdated.data);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("removeUnitAdmin - Failed to remove admin (500)", async () => {
    const error = new Error("Internal Error");
    services.unitService.getUnitById = jest.fn().mockRejectedValue(error);

    await controllers.unitController.removeUnitAdmin(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error: 'Erro ao remover usuário como administrador'
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

});
