import 'dotenv/config';
import axios from 'axios';
import { FlowUserController } from '../../src/controllers/flowUser';

jest.mock('axios');

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('FlowUserController', () => {
  let flowUserController;

  beforeEach(() => {
    flowUserController = new FlowUserController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('index - list all flow users (200)', async () => {
    flowUserController.flowUserService.findAll = jest
      .fn()
      .mockResolvedValue([]);

    await flowUserController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith([]);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('index - return message (404)', async () => {
    flowUserController.flowUserService.findAll = jest
      .fn()
      .mockResolvedValue(false);

    await flowUserController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Não existem fluxos de usuários cadatradas',
    });
    expect(resMock.status).toHaveBeenCalledWith(404);
  });

  test('index - internal server error (500)', async () => {
    const error = new Error('Internal Server Error');
    flowUserController.flowUserService.findAll = jest
      .fn()
      .mockRejectedValue(error);

    await flowUserController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Erro ao buscar fluxos de usuários',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });
});
