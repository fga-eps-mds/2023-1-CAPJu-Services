import { FlowController } from '../../src/controllers/flow.js';
import FlowService from '../../src/services/flow.js';
import models from '../../src/models/_index.js';
import FlowModel from '../../src/models/flow.js';

describe('FlowController', () => {
  let flowController;
  let flowServiceMock;
  let reqMock;
  let resMock;
  let flowService;
  let FlowModelMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(() => {
    flowServiceMock = new FlowService(models.Flow);
    flowController = new FlowController(flowServiceMock);
    reqMock = {
      body: {},
      params: {},
    };
    resMock = {
      json: jest.fn(),
      status: jest.fn(() => resMock),
    };
    flowService = new FlowService(FlowModelMock);
  });

  describe('findAll', () => {
    it('Retornar uma lista de fluxos', async () => {
      FlowModelMock.findAll.mockResolvedValue([
        { idFlow: 1, name: 'Fluxo 1' },
        { idFlow: 2, name: 'Fluxo 2' },
      ]);

      const result = await flowService.findAll();

      expect(result).toEqual([
        { idFlow: 1, name: 'Fluxo 1' },
        { idFlow: 2, name: 'Fluxo 2' },
      ]);
      expect(FlowModelMock.findAll).toHaveBeenCalled();
    });
  });

  describe('findOneByFlowId', () => {
    it('Retornar um fluxo com o ID especificado', async () => {
      const flowId = 1;
      FlowModelMock.findOne.mockResolvedValue({
        idFlow: flowId,
        name: 'Fluxo 1',
      });

      const result = await flowService.findOneByFlowId(flowId);

      expect(result).toEqual({ idFlow: flowId, name: 'Fluxo 1' });
      expect(FlowModelMock.findOne).toHaveBeenCalledWith({
        where: { idFlow: flowId },
      });
    });
  });

  describe('createFlow', () => {
    it('Criar um novo fluxo com os parâmetros fornecidos', async () => {
      const params = { name: 'Novo Fluxo' };
      FlowModelMock.create.mockResolvedValue({ idFlow: 3, ...params });

      const result = await flowService.createFlow(params);

      expect(result).toEqual({ idFlow: 3, ...params });
      expect(FlowModelMock.create).toHaveBeenCalledWith(params);
    });
  });

  describe('updateFlow', () => {
    it('Atualizar um fluxo com o nome e ID fornecidos', async () => {
      const name = 'Fluxo Atualizado';
      const idFlow = 1;
      FlowModelMock.update.mockResolvedValue([1]);

      FlowModelMock.findOne.mockResolvedValue({ idFlow, name });

      const result = await flowService.updateFlow(name, idFlow);

      expect(result).toEqual({ idFlow, name });
      expect(FlowModelMock.update).toHaveBeenCalledWith(
        { name },
        { where: { idFlow } },
      );
      expect(FlowModelMock.findOne).toHaveBeenCalledWith({ where: { idFlow } });
    });

    it('Retornar false se o fluxo não foi atualizado', async () => {
      const name = 'Fluxo Atualizado';
      const idFlow = 1;
      FlowModelMock.update.mockResolvedValue([0]);

      const result = await flowService.updateFlow(name, idFlow);

      expect(result).toBe(false);
      expect(FlowModelMock.update).toHaveBeenCalledWith(
        { name },
        { where: { idFlow } },
      );
      expect(FlowModelMock.findOne).not.toHaveBeenCalled();
    });
  });

  describe('deleteFlowById', () => {
    it('Excluir um fluxo com o ID fornecido', async () => {
      const idFlow = 1;
      FlowModelMock.destroy.mockResolvedValue(1);

      const result = await flowService.deleteFlowById(idFlow);

      expect(FlowModelMock.destroy).toHaveBeenCalledWith({ where: { idFlow } });
    });
  });

  describe('stagesSequencesFromFlowStages', () => {
    it('Retornar estágios e sequências a partir dos estágios do fluxo', async () => {
      const flowStages = [
        { idStageA: 1, commentary: 'Comentário 1', idStageB: 2 },
        { idStageA: 2, commentary: 'Comentário 2', idStageB: 3 },
      ];
      const expectedResult = {
        stages: [1, 2, 3],
        sequences: [
          { from: 1, commentary: 'Comentário 1', to: 2 },
          { from: 2, commentary: 'Comentário 2', to: 3 },
        ],
      };

      const result = await flowService.stagesSequencesFromFlowStages(
        flowStages,
      );

      expect(result).toEqual(expectedResult);
    });

    it('Retornar estágios e sequências vazios se os estágios do fluxo estiverem vazios', async () => {
      const flowStages = [];
      const expectedResult = {
        stages: [],
        sequences: [],
      };

      const result = await flowService.stagesSequencesFromFlowStages(
        flowStages,
      );

      expect(result).toEqual(expectedResult);
    });
  });
});
