import FlowService from '../../src/services/flow.js';

// Mock do modelo de fluxo
const FlowModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

describe('FlowService', () => {
  let flowService;

  beforeEach(() => {
   
    flowService = new FlowService(FlowModel);
  });

  describe('findAll', () => {
    it(' Retornar uma lista de fluxos', async () => {
      FlowModel.findAll.mockResolvedValue([
        { idFlow: 1, name: 'Fluxo 1' },
        { idFlow: 2, name: 'Fluxo 2' },
      ]);

      const result = await flowService.findAll();

      expect(result).toEqual([
        { idFlow: 1, name: 'Fluxo 1' },
        { idFlow: 2, name: 'Fluxo 2' },
      ]);
      expect(FlowModel.findAll).toHaveBeenCalled();
    });
  });

  describe('findOneByFlowId', () => {
    it('Retornar um fluxo com o ID especificado', async () => {
      const flowId = 1;
      FlowModel.findOne.mockResolvedValue({ idFlow: flowId, name: 'Fluxo 1' });

      const result = await flowService.findOneByFlowId(flowId);

      expect(result).toEqual({ idFlow: flowId, name: 'Fluxo 1' });
      expect(FlowModel.findOne).toHaveBeenCalledWith({ where: { idFlow: flowId } });
    });
  });

  describe('createFlow', () => {
    it('Criar um novo fluxo com os parâmetros fornecidos', async () => {
      const params = { name: 'Novo Fluxo' };
      FlowModel.create.mockResolvedValue({ idFlow: 3, ...params });

      const result = await flowService.createFlow(params);

      expect(result).toEqual({ idFlow: 3, ...params });
      expect(FlowModel.create).toHaveBeenCalledWith(params);
    });
  });

  describe('updateFlow', () => {
    it('Atualizar um fluxo com o nome e ID fornecidos', async () => {
      const name = 'Fluxo Atualizado';
      const idFlow = 1;
      FlowModel.update.mockResolvedValue([1]); 

      FlowModel.findOne.mockResolvedValue({ idFlow, name });

      const result = await flowService.updateFlow(name, idFlow);

      expect(result).toEqual({ idFlow, name });
      expect(FlowModel.update).toHaveBeenCalledWith({ name }, { where: { idFlow } });
      expect(FlowModel.findOne).toHaveBeenCalledWith({ where: { idFlow } });
    });

    it('Retornar false se o fluxo não foi atualizado', async () => {
      const name = 'Fluxo Atualizado';
      const idFlow = 1;
      FlowModel.update.mockResolvedValue([0]); 

      const result = await flowService.updateFlow(name, idFlow);

      expect(result).toBe(false);
      expect(FlowModel.update).toHaveBeenCalledWith({ name }, { where: { idFlow } });
      expect(FlowModel.findOne).not.toHaveBeenCalled();
    });
  });

  describe('deleteFlowById', () => {
    it('Excluir um fluxo com o ID fornecido', async () => {
      const idFlow = 1;
      FlowModel.destroy.mockResolvedValue(1); 

      const result = await flowService.deleteFlowById(idFlow);

      expect(FlowModel.destroy).toHaveBeenCalledWith({ where: { idFlow } });
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

      const result = await flowService.stagesSequencesFromFlowStages(flowStages);

      expect(result).toEqual(expectedResult);
    });

    it('Retornar estágios e sequências vazios se os estágios do fluxo estiverem vazios', async () => {
      const flowStages = [];
      const expectedResult = {
        stages: [],
        sequences: [],
      };

      const result = await flowService.stagesSequencesFromFlowStages(flowStages);

      expect(result).toEqual(expectedResult);
    });
  });

});
