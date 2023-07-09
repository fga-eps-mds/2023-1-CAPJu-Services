import 'dotenv/config';
import axios from 'axios';
import { PriorityController } from '../../src/controllers/priority.js';

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

  test("index - list all priorities (200)", async () => {
    priorityController.priorityService.findAll = jest.fn().mockResolvedValue([]);

    await priorityController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith([]);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("index - return message (204)", async () => {
    priorityController.priorityService.findAll = jest.fn().mockResolvedValue(false);

    await priorityController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({ message: "Não existem prioridades cadatradas" });
    expect(resMock.status).toHaveBeenCalledWith(204);
  });

  test("index - internal server error (500)", async () => {
    const error = new Error("Internal Server Error");
    priorityController.priorityService.findAll = jest.fn().mockRejectedValue(error);

    await priorityController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({ message: 'Erro ao buscar prioridades' });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });
});
