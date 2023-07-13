import StageService from '../../src/services/stage';

describe('StageService', () => {
  let stageService;
  let stageModelMock;

  beforeEach(() => {
    stageModelMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
    };

    stageService = new StageService(stageModelMock);
  });

  describe('findAll', () => {
    it('Deve retornar todas as etapas', async () => {
      const stages = [{ id: 1, name: 'Stage 1' }, { id: 2, name: 'Stage 2' }];
      stageModelMock.findAll.mockResolvedValue(stages);

      const result = await stageService.findAll();

      expect(result).toEqual(stages);
      expect(stageModelMock.findAll).toHaveBeenCalled();
    });
  });

  describe('findOneByStageId', () => {
    it('Deve retornar uma etapa com base no ID da etapa', async () => {
      const idStage = 1;
      const stage = { id: idStage, name: 'Stage 1' };
      stageModelMock.findOne.mockResolvedValue(stage);

      const result = await stageService.findOneByStageId(idStage);

      expect(result).toEqual(stage);
      expect(stageModelMock.findOne).toHaveBeenCalledWith({ where: { idStage } });
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

  describe('deleteStage', () => {
    it('Deve deletar uma etapa com base no ID da etapa', async () => {
      const idStage = 1;
      stageModelMock.destroy.mockResolvedValue(1);

      const result = await stageService.deleteStage(idStage);

   
      expect(stageModelMock.destroy).toHaveBeenCalledWith({ where: { idStage } });
    });
  });
});
