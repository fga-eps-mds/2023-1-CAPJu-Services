import 'dotenv/config';
import { PriorityController } from '../../src/controllers/priority';
import axios from 'axios';


jest.mock('axios');

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('PriorityController', () => {
  let priorityController;

  beforeEach(() => {
    priorityController = new PriorityController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('index - list all priorities (200)', async () => {
    priorityController.priorityService.findAll = jest
      .fn()
      .mockResolvedValue([]);

    await priorityController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith([]);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('index - no priorities found (401)', async () => {
    priorityController.priorityService.findAll = jest
      .fn()
      .mockResolvedValue(false);

    await priorityController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Não existem prioridades cadastradas',
    });
    expect(resMock.status).toHaveBeenCalledWith(401);
  });

  test('index - internal server error (500)', async () => {
    const error = new Error('Internal Server Error');
    priorityController.priorityService.findAll = jest
      .fn()
      .mockRejectedValue(error);

    await priorityController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Erro ao buscar prioridades',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });
});
