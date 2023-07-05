import 'dotenv/config';
import axios from 'axios';
import { UnitController } from '../../src/controllers/unit.js';

jest.mock('axios');

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('UnitController', () => {
  let unitController;

  beforeEach(() => {
    unitController = new UnitController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUnits', () => {
    it('should return all units when they exist', async () => {
      const units = [
        { id: 1, name: 'Unit 1' },
        { id: 2, name: 'Unit 2' },
      ];
      unitController.unitService.getAllUnits = jest
        .fn()
        .mockResolvedValue(units);

      await unitController.index(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(units);
    });

    it('should return a 401 status and message when no units exist', async () => {
      unitController.unitService.getAllUnits = jest
        .fn()
        .mockResolvedValue(null);

      await unitController.index(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Não Existe unidades',
      });
    });

    it('should return a 500 status and error message when an error occurs', async () => {
      const errorMessage = 'Erro ao buscar unidades';
      unitController.unitService.getAllUnits = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await unitController.index(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Erro ao buscar unidades',
      });
    });
  });

  describe('store', () => {
    it('should create a new unit and return it', async () => {
      const unitName = 'New Unit';
      const createdUnit = { id: 1, name: unitName };
      unitController.unitService.createUnit = jest
        .fn()
        .mockResolvedValue(createdUnit);
      reqMock.body = { name: unitName };

      await unitController.store(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(createdUnit);
    });

    it('should return a 500 status and error message when an error occurs', async () => {
      const unitName = 'New Unit';
      const errorMessage = 'Erro ao criar unidade';
      unitController.unitService.createUnit = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      reqMock.body = { name: unitName };

      await unitController.store(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        message: 'Erro ao criar unidade',
      });
    });
  });

  describe('update', () => {
    it('should update a unit and return a success message when update is successful', async () => {
      unitController.unitService.updateUnit = jest.fn().mockResolvedValue(true);
      const unitName = 'New Unit Name';
      reqMock.body = { name: unitName };

      await unitController.update(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Unidade atualizado com sucesso',
      });
    });

    it('should return a failure message with status 400 when unit update fails', async () => {
      unitController.unitService.updateUnit = jest
        .fn()
        .mockResolvedValue(false);
      const unitName = 'New Unit Name';
      reqMock.body = { name: unitName };

      await unitController.update(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Unidade não atualizada',
      });
    });

    it('should return a 500 status and error message when an error occurs', async () => {
      const errorMessage = 'Error updating unit';
      unitController.unitService.updateUnit = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      const unitName = 'New Unit Name';
      reqMock.body = { name: unitName };

      await unitController.update(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: new Error(errorMessage),
        message: 'Erro ao atualizar unidade',
      });
    });
  });

  describe('delete', () => {
    it('should delete a unit and return a success message when deletion is successful', async () => {
      const unitId = 1;
      reqMock.body = { idUnit: unitId };
      const unitMock = {
        destroy: jest.fn(),
      };
      unitController.unitService.getUnitById = jest
        .fn()
        .mockResolvedValue(unitMock);

      await unitController.delete(reqMock, resMock);

      expect(unitController.unitService.getUnitById).toHaveBeenCalledWith(
        unitId,
      );
      expect(unitMock.destroy).toHaveBeenCalled();
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Unidade apagada com sucesso',
      });
    });

    it('should return a 404 status and error message when unit does not exist', async () => {
      const unitId = 1;
      reqMock.body = { idUnit: unitId };
      unitController.unitService.getUnitById = jest
        .fn()
        .mockResolvedValue(null);

      await unitController.delete(reqMock, resMock);

      expect(unitController.unitService.getUnitById).toHaveBeenCalledWith(
        unitId,
      );
      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Unidade não existe!',
      });
    });

    it('should return a 500 status and error message when an error occurs', async () => {
      const unitId = 1;
      reqMock.body = { idUnit: unitId };
      const errorMessage = 'Error deleting unit';
      unitController.unitService.getUnitById = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await unitController.delete(reqMock, resMock);

      expect(unitController.unitService.getUnitById).toHaveBeenCalledWith(
        unitId,
      );
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: new Error(errorMessage),
        message: 'Erro ao apagar unidade',
      });
    });
  });

  describe('getAdminsByUnitId', () => {
    it('should return admins of a unit when the request is successful', async () => {
      const idUnit = 1;
      const admins = [
        { id: 1, name: 'Admin 1' },
        { id: 2, name: 'Admin 2' },
      ];
      reqMock.params = { idUnit };
      axios.get.mockResolvedValue({ data: admins });

      await unitController.showAdminsByUnitId(reqMock, resMock);

      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.USER_URL_API}/admins/unit/${idUnit}`,
      );
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(admins);
    });

    it('should return a 401 status and message when there are no admins in the unit', async () => {
      const idUnit = 1;
      reqMock.params = { idUnit };
      axios.get.mockResolvedValue({ data: [] });

      await unitController.showAdminsByUnitId(reqMock, resMock);

      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.USER_URL_API}/admins/unit/${idUnit}`,
      );
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Não existem usuários adminstradores nessa unidade',
      });
    });

    it('should return a 500 status and error message when an error occurs', async () => {
      const idUnit = 1;
      reqMock.params = { idUnit };
      const errorMessage = 'Erro ao buscar administradores';
      axios.get.mockRejectedValue(new Error(errorMessage));

      await unitController.showAdminsByUnitId(reqMock, resMock);

      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.USER_URL_API}/admins/unit/${idUnit}`,
      );
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Erro ao buscar administradores',
      });
    });
  });
});
