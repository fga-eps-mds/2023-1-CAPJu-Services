import { Op } from 'sequelize';
import FlowStageService from '../../src/services/flowStage';

const FlowStageModel = {
  findAll: jest.fn(),
  findAllByIdFlow: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
};

describe('FlowStageService', () => {
  let flowStageService;

  beforeEach(() => {
    flowStageService = new FlowStageService(FlowStageModel);
  });

  describe('findAll', () => {
    it(' Retornar uma lista de estágios do fluxo', async () => {
      FlowStageModel.findAll.mockResolvedValue([
        { idFlow: 1, idStageA: 1, idStageB: 2 },
        { idFlow: 1, idStageA: 2, idStageB: 3 },
      ]);

      const result = await flowStageService.findAll();

      expect(result).toEqual([
        { idFlow: 1, idStageA: 1, idStageB: 2 },
        { idFlow: 1, idStageA: 2, idStageB: 3 },
      ]);
      expect(FlowStageModel.findAll).toHaveBeenCalled();
    });
  });

  describe('findAllByIdFlow', () => {
    it(' Retornar uma lista de estágios do fluxo com o ID de fluxo especificado', async () => {
      const idFlow = 1;
      FlowStageModel.findAllByIdFlow.mockResolvedValue([
        { idFlow, idStageA: 1, idStageB: 2 },
        { idFlow, idStageA: 2, idStageB: 3 },
      ]);

      const result = await flowStageService.findAllByIdFlow(idFlow);

      expect(result).toEqual([
        { idFlow, idStageA: 1, idStageB: 2 },
        { idFlow, idStageA: 2, idStageB: 3 },
      ]);
    });
  });

  describe('createFlowStage', () => {
    it(' criar um novo estágio do fluxo com os parâmetros fornecidos', async () => {
      const payload = { idFlow: 1, idStageA: 1, idStageB: 2 };
      FlowStageModel.create.mockResolvedValue({ ...payload });

      const result = await flowStageService.createFlowStage(payload);

      expect(result).toEqual({ ...payload });
      expect(FlowStageModel.create).toHaveBeenCalledWith(payload);
    });
  });

  describe('deleteFlowStageByIdFlow', () => {
    it(' excluir os estágios do fluxo com o ID de fluxo fornecido', async () => {
      const idFlow = 1;
      FlowStageModel.destroy.mockResolvedValue();

      await flowStageService.deleteFlowStageByIdFlow(idFlow);

      expect(FlowStageModel.destroy).toHaveBeenCalledWith({
        where: { idFlow },
      });
    });
  });

  describe('deleteFlowStageByIdFlowAndStages', () => {
    it(' excluir um estágio do fluxo com o ID de fluxo, ID do estágio A e ID do estágio B fornecidos', async () => {
      const idFlow = 1;
      const idStageA = 1;
      const idStageB = 2;
      FlowStageModel.destroy.mockResolvedValue();

      await flowStageService.deleteFlowStageByIdFlowAndStages(
        idFlow,
        idStageA,
        idStageB,
      );

      expect(FlowStageModel.destroy).toHaveBeenCalledWith({
        where: {
          [Op.and]: {
            idFlow,
            idStageA,
            idStageB,
          },
        },
      });
    });
  });
});
