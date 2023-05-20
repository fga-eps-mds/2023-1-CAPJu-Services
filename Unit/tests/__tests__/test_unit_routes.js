import axios from "axios";
import UnitController from "../../src/controllers/unit.js";
import Unit from "../../src/models/unit.js";
import { ROLE } from "../../src/schemas/role.js";

jest.mock("axios");

describe("UnitController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("index", () => {
    it("should return units when they exist", async () => {
      const mockUnits = [
        { id: 1, name: "Unit 1" },
        { id: 2, name: "Unit 2" },
      ];
      Unit.findAll = jest.fn().mockResolvedValue(mockUnits);
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UnitController.index({}, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUnits);
    });

    it("should return an error when units do not exist", async () => {
      Unit.findAll = jest.fn().mockResolvedValue(null);
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UnitController.index({}, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Não Existe unidades" });
    });
  });

  describe("store", () => {
    it("should create a new unit", async () => {
      const req = {
        body: { name: "Unit 1" },
      };
      const mockUnit = { id: 1, name: "Unit 1" };
      Unit.create = jest.fn().mockResolvedValue(mockUnit);
      const res = {
        json: jest.fn(),
      };

      await UnitController.store(req, res);

      expect(Unit.create).toHaveBeenCalledWith({ name: "Unit 1" });
      expect(res.json).toHaveBeenCalledWith(mockUnit);
    });

    it("should return an error when creating a unit fails", async () => {
      const req = {
        body: { name: "Unit 1" },
      };
      const errorMessage = "Error creating unit";
      Unit.create = jest.fn().mockRejectedValue(new Error(errorMessage));
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UnitController.store(req, res);

      expect(Unit.create).toHaveBeenCalledWith({ name: "Unit 1" });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: new Error(errorMessage),
        message: "Erro ao criar unidade",
      });
    });
  });

  describe("update", () => {
    it("should update an existing unit", async () => {
      const req = {
        body: { idUnit: 1, name: "Updated Unit" },
      };
      const mockUnit = { id: 1, name: "Old Unit" };
      const mockSave = jest.fn().mockResolvedValue(mockUnit);
      const mockFindByPk = jest.spyOn(Unit, "findByPk").mockResolvedValue(mockUnit);
      mockUnit.save = mockSave;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UnitController.update(req, res);

      expect(mockFindByPk).toHaveBeenCalledWith(1);
      expect(mockUnit.name).toBe("Updated Unit");
      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUnit);
    });

    it("should return an error when updating a non-existing unit", async () => {
      const req = {
        body: { idUnit: 1, name: "Updated Unit" },
      };
      Unit.findByPk = jest.fn().mockResolvedValue(null);
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UnitController.update(req, res);

      expect(Unit.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Essa unidade não existe!" });
    });

    it("should return an error when an exception occurs", async () => {
      const req = {
        body: { idUnit: 1, name: "Updated Unit" },
      };
      const errorMessage = "Error updating unit";
      const mockFindByPk = jest.spyOn(Unit, "findByPk").mockRejectedValue(new Error(errorMessage));
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UnitController.update(req, res);

      expect(mockFindByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: new Error(errorMessage),
        message: "Erro ao atualizar unidade",
      });
    });
  });

  describe("delete", () => {
    it("should delete an existing unit", async () => {
      const req = {
        body: { idUnit: 1 },
      };
      const mockUnit = { id: 1, name: "Unit 1" };
      Unit.findByPk = jest.fn().mockResolvedValue(mockUnit);
      const destroyMock = jest.fn();
      mockUnit.destroy = destroyMock;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UnitController.delete(req, res);

      expect(Unit.findByPk).toHaveBeenCalledWith(1);
      expect(destroyMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUnit);
    });

    it("should return an error when deleting a non-existing unit", async () => {
      const req = {
        body: { idUnit: 1 },
      };
      Unit.findByPk = jest.fn().mockResolvedValue(null);
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UnitController.delete(req, res);

      expect(Unit.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Essa unidade não existe!" });
    });
  });

  describe("getAdminsByUnitId", () => {
    it("should return the user if there are admins for the unit", async () => {
      const req = {
        params: { id: 1 },
      };
      const mockUsersResponse = {
        data: JSON.stringify([{ id: 1, name: "Admin" }]),
      };
      axios.get.mockResolvedValue(mockUsersResponse);
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UnitController.getAdminsByUnitId(req, res);

      expect(axios.get).toHaveBeenCalledWith(`${process.env.API_URL_USER}/users`, {
        params: {
          idUnit: 1,
          idRole: ROLE.DIRETOR,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, name: "Admin" }]);
    });

    it("should return an error if there are no admins for the unit", async () => {
      const req = {
        params: { id: 1 },
      };
      const mockUsersResponse = {
        data: JSON.stringify([]),
      };
      axios.get.mockResolvedValue(mockUsersResponse);
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UnitController.getAdminsByUnitId(req, res);

      expect(axios.get).toHaveBeenCalledWith(`${process.env.API_URL_USER}/users`, {
        params: {
          idUnit: 1,
          idRole: ROLE.DIRETOR,
        },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Não há administradores para essa unidade" });
    });

    it("should handle errors when making the API request", async () => {
      const req = {
        params: { id: 1 },
      };
      const errorMessage = "Erro ao buscar administradores";
      const mockRejectedPromise = Promise.reject(new Error(errorMessage));
      axios.get.mockReturnValue(mockRejectedPromise);
      console.error = jest.fn();
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UnitController.getAdminsByUnitId(req, res);

      expect(axios.get).toHaveBeenCalledWith(`${process.env.API_URL_USER}/users`, {
        params: {
          idUnit: 1,
          idRole: ROLE.DIRETOR,
        },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao buscar administradores",
      });
    });
  });
});
