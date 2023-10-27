import { Op } from 'sequelize';
import FlowStageService from '../../src/services/flowStage';
import sequelizeConfig from '../../src/config/sequelize.js';
import { QueryTypes } from 'sequelize';

const FlowStageModel = {
  findAll: jest.fn(),
  findAllByIdFlow: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
};

jest.mock('../../src/config/sequelize.js', () => ({
  query: jest.fn(),
}));


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

  describe('findFlowStagesByFlowId', () => {
    it('retornar o tempo medio de um fluxo', async () => {
      const flowId = 3;

      const query_results = [
        {
          idStage: 1,
          name: "Primeira Etapa",
          duration: 5
        },
        {
          idStage: 2,
          name: "Segunda Etapa",
          duration: 2
        },
        {
          idStage: 3,
          name: "Terceira Etapa",
          duration: 2
        }
      ]

      sequelizeConfig.query.mockResolvedValue(query_results)
      const result = await flowStageService.findFlowStagesByFlowId(flowId);

      expect(result).toEqual(query_results);

      expect(sequelizeConfig.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          replacements: [flowId, flowId],
          type: QueryTypes.SELECT,
        }),
      );
  
    });
  });
});
