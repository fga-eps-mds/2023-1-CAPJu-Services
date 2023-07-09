import 'dotenv/config';
import axios from 'axios';
import { FlowStageController } from '../../src/controllers/flowStage.js';

jest.mock('axios');

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('FlowStageControlers', () => {
  let flowStageController;

  beforeEach(() => {
    flowStageController = new FlowStageController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('index - list all stages (200)', async () => {
    flowStageController.flowStageService.findAll = jest
      .fn()
      .mockResolvedValue([]);

    await flowStageController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith([]);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('index - return message (404)', async () => {
    flowStageController.flowStageService.findAll = jest
      .fn()
      .mockResolvedValue(false);

    await flowStageController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Não há fluxos ligados a etapas',
    });
    expect(resMock.status).toHaveBeenCalledWith(404);
  });

  test('index - internal server error (500)', async () => {
    const error = new Error('Internal Server Error');
    flowStageController.flowStageService.findAll = jest
      .fn()
      .mockRejectedValue(error);

    await flowStageController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error,
      message: 'Erro ao ler fluxos ligados a etapas',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test('delete - remove flowStage (200)', async () => {
    flowStageController.flowStageService.deleteFlowStageByIdFlowAndStages = jest
      .fn()
      .mockResolvedValue(1);

    reqMock.params = {
      idFlow: 0,
      idStageA: 1,
      idStageB: 2,
    };

    await flowStageController.delete(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: `Desassociação entre fluxo '0' e etapas '1' e '2' concluída`,
    });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('delete - flowStage not found (404)', async () => {
    flowStageController.flowStageService.deleteFlowStageByIdFlowAndStages = jest
      .fn()
      .mockResolvedValue(0);

    reqMock.params = {
      idFlow: 0,
      idStageA: 1,
      idStageB: 2,
    };

    await flowStageController.delete(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: `Não há relacionamento entre o fluxo '0' e as etapas '1' e '2'`,
    });
    expect(resMock.status).toHaveBeenCalledWith(404);
  });

  test('delete - internal server error (500)', async () => {
    const error = new Error('Internal Server Error');
    flowStageController.flowStageService.deleteFlowStageByIdFlowAndStages = jest
      .fn()
      .mockRejectedValue(error);

    reqMock.params = {
      idFlow: 0,
      idStageA: 1,
      idStageB: 2,
    };

    await flowStageController.delete(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error,
      message: `Falha ao desassociar fluxo '0' e etapas '1' e '2'`,
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });
});
