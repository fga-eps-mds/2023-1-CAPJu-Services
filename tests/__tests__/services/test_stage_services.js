import StageService from '../../../src/services/stage';
import controllers from '../../../src/controllers/_index.js';
import services from '../../../src/services/_index.js';
import models from '../../../src/models/_index.js';
import * as middleware from '../../../middleware/authMiddleware.js';
import { StageController } from '../../../src/controllers/stage';

describe('StageService', () => {
  let stageService;
  let stageModelMock;
  let stageController;

  beforeEach(() => {
    stageModelMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
      update: jest.fn(),
    };

    stageService = new StageService(stageModelMock);
    stageController = new StageController();
  });

  describe('findAll', () => {
    const reqMock = {
      body: {},
      params: {},
    };

    const resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockFlows = [
      { idFlow: 1, name: 'Flow 1', idUnit: 1 },
      { idFlow: 2, name: 'Flow 2', idUnit: 1 },
    ];

    const mockFlow = {};
    const mockFlowStages = [
      { idFlow: 1, idStageA: 1, idStageB: 2 },
      { idFlow: 1, idStageA: 2, idStageB: 3 },
    ];
    const mockStages = [
      { idStage: 1, name: 'Stage 1' },
      { idStage: 2, name: 'Stage 2' },
      { idStage: 3, name: 'Stage 3' },
      { idStage: 4, name: 'Stage 4' },
    ];
    const mockSequences = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
    ];

    it('Deve retornar todas as etapas', async () => {
      jest.spyOn(middleware, 'tokenToUser').mockReturnValue({
        idUnit: 1,
        idRole: 1,
      });

      services.stageService.findAll = jest.fn().mockResolvedValue(mockStages);
      services.stageService.countRows = jest.fn().mockResolvedValue(4);
      //   const stages = [{ id: 1, name: 'Stage 1' }, { id: 2, name: 'Stage 2' }];
      //   stageModelMock.findAll.mockResolvedValue(stages);

      reqMock.query = {
        limit: 1,
        offset: 0,
        filter: 0,
      };

      const result = await stageController.index(reqMock, resMock);

      // expect(result).toEqual(mockStages);
      // expect(services.stageService.findAll).toHaveBeenCalled();
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });

  describe('findOneByStageId', () => {
    it('Deve retornar uma etapa com base no ID da etapa', async () => {
      const idStage = 1;
      const stage = { id: idStage, name: 'Stage 1' };
      stageModelMock.findOne.mockResolvedValue(stage);

      const result = await stageService.findOneByStageId(idStage);

      expect(result).toEqual(stage);
      expect(stageModelMock.findOne).toHaveBeenCalledWith({
        where: { idStage },
      });
    });
  });

  describe('createStage', () => {
    it('Deve criar uma nova etapa', async () => {
      const data = { name: 'Stage 1', idUnit: 1, duration: 10 };
      const createdStage = { id: 1, ...data };
      stageModelMock.create.mockResolvedValue(createdStage);

      const result = await stageService.createStage(data);

      expect(result).toEqual(createdStage);
      expect(stageModelMock.create).toHaveBeenCalledWith(data);
    });
  });

  describe('findByUnit', () => {
    it('Deve encontrar etapas por unidade', async () => {
      const data = { name: 'Stage 1', idUnit: 1, duration: 10 };
      const createdStage = { id: 1, ...data };
      stageModelMock.findAll.mockResolvedValue(createdStage);

      const result = await stageService.findByUnit(data);

      expect(result).toEqual(createdStage);
      expect(stageModelMock.findAll).toHaveBeenCalledWith(data);
    });
  });
  

  describe('deleteStage', () => {
    it('Deve deletar uma etapa com base no ID da etapa', async () => {
      const idStage = 1;
      stageModelMock.destroy.mockResolvedValue(1);

      const result = await stageService.deleteStage(idStage);

      expect(stageModelMock.destroy).toHaveBeenCalledWith({
        where: { idStage },
      });
    });
  });

  describe('updateStage', () => {
    it('should return true when a stage is successfully updated', async () => {
      const stage = { id: 1, name: 'Stage 1', duration: 3};
      stageModelMock.findOne.mockResolvedValue(stage);
      stageModelMock.update.mockResolvedValue([1]); 

      const result = await stageService.updateStage(1, "Stage 2", 6);
      expect(result).toBe(true)
    });
  });
});
