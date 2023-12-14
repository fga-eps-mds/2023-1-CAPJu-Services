import PriorityService from '../../../src/services/priority';

const PriorityModel = {
  findAll: jest.fn(),
};

describe('PriorityService', () => {
  let priorityService;

  beforeEach(() => {
    priorityService = new PriorityService(PriorityModel);
  });

  describe('findAll', () => {
    it(' Retornar uma lista de prioridades', async () => {
      PriorityModel.findAll.mockResolvedValue([
        { id: 1, name: 'alta' },
        { id: 2, name: 'media' },
        { id: 3, name: 'baixa' },
      ]);

      const result = await priorityService.findAll();

      expect(result).toEqual([
        { id: 1, name: 'alta' },
        { id: 2, name: 'media' },
        { id: 3, name: 'baixa' },
      ]);
      expect(PriorityModel.findAll).toHaveBeenCalled();
    });
  });
});
