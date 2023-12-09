import 'dotenv/config';
import axios from 'axios';
import { StatisticsController } from '../../../src/controllers/statistics.js';
import ProcessService from '../../../src/services/process.js';
import StageService from '../../../src/services/stage.js';

//jest.mock('../services/_index.js');
jest.mock('axios');

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('statisticsController', () => {
  let statisticsController;

  beforeEach(() => {
    statisticsController = new StatisticsController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getProcessByStepInFlow - process found (200)', async () => {
    const mockProcesses = {
      count: 2,
      rows: [
        { id: 1, name: 'Process 1', idStage: 1, idFlow: 1 },
        { id: 2, name: 'Process 2', idStage: 1, idFlow: 1 },
      ],
    };

    const getAndCountAllProcessSpy = jest
      .spyOn(ProcessService.prototype, 'getAndCountAllProcess')
      .mockResolvedValue(mockProcesses);

    reqMock.params = { idFlow: 1, idStage: 1 };
    reqMock.query = { offset: 0, limit: 5 };

    await statisticsController.getProcessByStepInFlow(reqMock, resMock);

    expect(getAndCountAllProcessSpy).toHaveBeenCalled();
    expect(resMock.json).toHaveBeenCalledWith({
      process: mockProcesses.rows,
      totalPages: 1,
    });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('getProcessByStepInFlow - process found - second ternary (200)', async () => {
    const mockProcesses = {
      count: 0,
      rows: [
        { id: 1, name: 'Process 1', idStage: 1, idFlow: 1 },
        { id: 2, name: 'Process 2', idStage: 1, idFlow: 1 },
      ],
    };

    const getAndCountAllProcessSpy = jest
      .spyOn(ProcessService.prototype, 'getAndCountAllProcess')
      .mockResolvedValue(mockProcesses);

    reqMock.params = { idFlow: 1, idStage: 1 };
    reqMock.query = {};

    await statisticsController.getProcessByStepInFlow(reqMock, resMock);

    expect(getAndCountAllProcessSpy).toHaveBeenCalled();
    expect(resMock.json).toHaveBeenCalledWith({
      process: mockProcesses.rows,
      totalPages: 0,
    });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('getProcessByStepInFlow - no idFlow (412)', async () => {
    reqMock.params = { idStage: 1 };
    reqMock.query = { offset: 0, limit: 5 };

    await statisticsController.getProcessByStepInFlow(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error: 'É necessário fornecer um id de um fluxo',
    });
    expect(resMock.status).toHaveBeenCalledWith(412);
  });

  test('getProcessByStepInFlow - no idStage (412)', async () => {
    reqMock.params = { idFlow: 1 };
    reqMock.query = { offset: 0, limit: 5 };

    await statisticsController.getProcessByStepInFlow(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error: 'É necessário fornecer um id de uma etapa',
    });
    expect(resMock.status).toHaveBeenCalledWith(412);
  });

  test('getProcessByStepInFlow - error (500)', async () => {
    const error = new Error();

    const getAndCountAllProcessSpy = jest
      .spyOn(ProcessService.prototype, 'getAndCountAllProcess')
      .mockRejectedValue(error);

    reqMock.params = { idStage: 1, idFlow: 1 };

    await statisticsController.getProcessByStepInFlow(reqMock, resMock);

    expect(getAndCountAllProcessSpy).toHaveBeenCalled();
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test('getProcessCountByStepInFlow - process found (200)', async () => {
    const mockProcesses = [
      { id: 1, name: 'Process 1', idStage: 1, idFlow: 1 },
      { id: 2, name: 'Process 2', idStage: 1, idFlow: 1 },
    ];

    const mockStages = { name: 'Etapa01' };

    const getProcessByIdFlowSpy = jest
      .spyOn(ProcessService.prototype, 'getProcessByIdFlow')
      .mockResolvedValue(mockProcesses);
    const findOneByStageIdSpy = jest
      .spyOn(StageService.prototype, 'findOneByStageId')
      .mockResolvedValue(mockStages);

    reqMock.params = { idFlow: 1 };

    await statisticsController.getProcessCountByStepInFlow(reqMock, resMock);

    expect(getProcessByIdFlowSpy).toHaveBeenCalled();
    expect(findOneByStageIdSpy).toHaveBeenCalled();
    expect(resMock.json).toHaveBeenCalledWith({
      stages: {
        1: {
          name: 'Etapa01',
          idStage: 1,
          countProcess: 2,
        },
      },
    });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('getProcessCountByStepInFlow - process found (200)', async () => {
    const mockProcesses = [{ id: 1, name: 'Process 1', idFlow: 1 }];

    const mockStages = {};

    const getProcessByIdFlowSpy = jest
      .spyOn(ProcessService.prototype, 'getProcessByIdFlow')
      .mockResolvedValue(mockProcesses);
    const findOneByStageIdSpy = jest
      .spyOn(StageService.prototype, 'findOneByStageId')
      .mockResolvedValue(mockStages);

    reqMock.params = { idFlow: 1 };

    await statisticsController.getProcessCountByStepInFlow(reqMock, resMock);

    expect(getProcessByIdFlowSpy).toHaveBeenCalled();
    expect(findOneByStageIdSpy).toHaveBeenCalled();
    expect(resMock.json).toHaveBeenCalledWith({
      stages: {
        nao_iniciado: {
          idStage: 'nao_iniciado',
          name: 'nao iniciado',
          countProcess: 1,
        },
      },
    });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('getProcessCountByStepInFlow - process found (200)', async () => {
    const mockProcesses = [
      { id: 1, name: 'Process 1', idStage: null, idFlow: 1 },
    ];

    const mockStages = {};

    const getProcessByIdFlowSpy = jest
      .spyOn(ProcessService.prototype, 'getProcessByIdFlow')
      .mockResolvedValue(mockProcesses);
    const findOneByStageIdSpy = jest
      .spyOn(StageService.prototype, 'findOneByStageId')
      .mockResolvedValue(mockStages);

    reqMock.params = { idFlow: 1 };

    await statisticsController.getProcessCountByStepInFlow(reqMock, resMock);

    expect(getProcessByIdFlowSpy).toHaveBeenCalled();
    expect(findOneByStageIdSpy).toHaveBeenCalled();
    expect(resMock.json).toHaveBeenCalledWith({
      stages: {
        nao_iniciado: {
          idStage: 'nao_iniciado',
          name: 'nao iniciado',
          countProcess: 1,
        },
      },
    });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('getProcessCountByStepInFlow - process found (200)', async () => {
    const mockProcesses = [
      { id: 1, name: 'Process 1', idStage: 1, idFlow: 1 },
      { id: 2, name: 'Process 2', idStage: 1, idFlow: 1 },
    ];

    const mockStages = { name: 'Etapa01' };

    const getProcessByIdFlowSpy = jest
      .spyOn(ProcessService.prototype, 'getProcessByIdFlow')
      .mockResolvedValue(mockProcesses);
    const findOneByStageIdSpy = jest
      .spyOn(StageService.prototype, 'findOneByStageId')
      .mockResolvedValue(mockStages);

    reqMock.params = { idFlow: 1 };

    await statisticsController.getProcessCountByStepInFlow(reqMock, resMock);

    expect(getProcessByIdFlowSpy).toHaveBeenCalled();
    expect(findOneByStageIdSpy).toHaveBeenCalled();
    expect(resMock.json).toHaveBeenCalledWith({
      stages: {
        1: {
          name: 'Etapa01',
          idStage: 1,
          countProcess: 2,
        },
      },
    });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('getProcessCountByStepInFlow - process no idFlow (412)', async () => {
    reqMock.params = {};

    await statisticsController.getProcessCountByStepInFlow(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error: 'É necessário fornecer um id de um fluxo',
    });
    expect(resMock.status).toHaveBeenCalledWith(412);
  });

  test('getProcessCountByStepInFlow - error (500)', async () => {
    const mockProcesses = [
      { id: 1, name: 'Process 1', idStage: 1, idFlow: 1 },
      { id: 2, name: 'Process 2', idStage: 2, idFlow: 1 },
      { id: 3, name: 'Process 3', idStage: null, idFlow: 1 },
    ];

    const error = new Error();

    const getProcessByIdFlowSpy = jest
      .spyOn(ProcessService.prototype, 'getProcessByIdFlow')
      .mockResolvedValue(mockProcesses);
    const findOneByStageIdSpy = jest
      .spyOn(StageService.prototype, 'findOneByStageId')
      .mockRejectedValue(error);

    reqMock.params = { idFlow: 1 };

    await statisticsController.getProcessCountByStepInFlow(reqMock, resMock);

    expect(getProcessByIdFlowSpy).toHaveBeenCalled();
    expect(findOneByStageIdSpy).toHaveBeenCalled();
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test('getAllProcessByStepInStage - process found (200)', async () => {
    const mockProcesses = [
      { id: 1, name: 'Process 1', idStage: 1, idFlow: 1 },
      { id: 2, name: 'Process 2', idStage: 1, idFlow: 1 },
    ];

    const getAllProcessSpy = jest
      .spyOn(ProcessService.prototype, 'getAllProcess')
      .mockResolvedValue(mockProcesses);

    reqMock.params = { idFlow: 1, idStage: 1 };

    await statisticsController.getAllProcessByStepInStage(reqMock, resMock);

    expect(getAllProcessSpy).toHaveBeenCalled();
    expect(resMock.json).toHaveBeenCalledWith({ process: mockProcesses });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('getAllProcessByStepInStage - process no idFlow (412)', async () => {
    reqMock.params = { idStage: 1 };

    await statisticsController.getAllProcessByStepInStage(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error: 'É necessário fornecer um id de um fluxo',
    });
    expect(resMock.status).toHaveBeenCalledWith(412);
  });

  test('getAllProcessByStepInStage - process no idStage (412)', async () => {
    reqMock.params = { idFlow: 1 };

    await statisticsController.getAllProcessByStepInStage(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error: 'É necessário fornecer um id de uma etapa',
    });
    expect(resMock.status).toHaveBeenCalledWith(412);
  });

  test('getAllProcessByStepInStage - error (500)', async () => {
    const error = new Error();

    const getAllProcessSpy = jest
      .spyOn(ProcessService.prototype, 'getAllProcess')
      .mockRejectedValue(error);

    reqMock.params = { idStage: 1, idFlow: 1 };

    await statisticsController.getAllProcessByStepInStage(reqMock, resMock);

    expect(getAllProcessSpy).toHaveBeenCalled();
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test('getProcessByDueDateInFlow - process found (200)', async () => {
    const mockProcesses = [
      {
        record: '4905241-90.2023.6.17.7722',
        nickname: 'Process 1',
        idStage: 1,
        idFlow: 1,
        status: 'inProgess',
        idUnit: 1,
        effectiveDate: '11/24/2023',
        nameStage: 'Etapa 1',
        nameFlow: 'Fluxo 1',
        dueDate: '11/25/2023 02:34:08.878+00',
      },
    ];

    const mockResponse = [
      {
        record: '4905241-90.2023.6.17.7722',
        nickname: 'Process 1',
        idStage: 1,
        idFlow: 1,
        status: 'inProgess',
        idUnit: 1,
        effectiveDate: '11/24/2023',
        nameStage: 'Etapa 1',
        nameFlow: 'Fluxo 1',
        dueDate: '24/11/2023',
      },
    ];
    reqMock.query = { offset: 5, limit: 10 };
    reqMock.params = { minDate: '11/23/2023', maxDate: '11/26/2023' };

    statisticsController.statisticsService.SearchDueDate = jest
      .fn()
      .mockResolvedValue(mockProcesses);

    statisticsController.statisticsService.countRowsDueDate = jest
      .fn()
      .mockResolvedValue(mockProcesses.length);

    await statisticsController.getProcessByDueDateInFlow(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({
      processInDue: mockResponse,
      totalPages: 1,
    });
  });

  test('getProcessByDueDateInFlow - process found (200)', async () => {
    const mockProcesses = [
      {
        record: '4905241-90.2023.6.17.7722',
        nickname: 'Process 1',
        idStage: 1,
        idFlow: 1,
        status: 'inProgess',
        idUnit: 1,
        effectiveDate: '11/24/2023',
        nameStage: 'Etapa 1',
        nameFlow: 'Fluxo 1',
        dueDate: '11/25/2023 02:34:08.878+00',
      },
    ];

    const mockResponse = [
      {
        record: '4905241-90.2023.6.17.7722',
        nickname: 'Process 1',
        idStage: 1,
        idFlow: 1,
        status: 'inProgess',
        idUnit: 1,
        effectiveDate: '11/24/2023',
        nameStage: 'Etapa 1',
        nameFlow: 'Fluxo 1',
        dueDate: '24/11/2023',
      },
    ];
    reqMock.query = { offset: 5, limit: 10 };
    reqMock.params = { minDate: '11/23/2023', maxDate: '11/26/2023' };

    statisticsController.statisticsService.SearchDueDate = jest
      .fn()
      .mockResolvedValue(mockProcesses);

    statisticsController.statisticsService.countRowsDueDate = jest
      .fn()
      .mockResolvedValue(mockProcesses.length);

    await statisticsController.getProcessByDueDateInFlow(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({
      processInDue: mockResponse,
      totalPages: 1,
    });
  });

  test('getProcessByDueDateInFlow - process found - second ternary (200)', async () => {
    const mockProcesses = [];

    const mockResponse = [];
    reqMock.query = {};
    reqMock.params = { minDate: '11/23/2023', maxDate: '11/26/2023' };

    statisticsController.statisticsService.SearchDueDate = jest
      .fn()
      .mockResolvedValue(mockProcesses);

    statisticsController.statisticsService.countRowsDueDate = jest
      .fn()
      .mockResolvedValue(mockProcesses.length);

    await statisticsController.getProcessByDueDateInFlow(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({
      processInDue: mockResponse,
      totalPages: 0,
    });
  });

  test('getProcessByDueDateInFlow - error (500)', async () => {
    const error = new Error('Internal Server Error');

    reqMock.query = { offset: 5, limit: 10 };
    reqMock.params = { minDate: '11/23/2023', maxDate: '11/26/2023' };

    statisticsController.statisticsService.SearchDueDate = jest
      .fn()
      .mockRejectedValue(error);

    await statisticsController.getProcessByDueDateInFlow(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith({ message: error });
  });

  test('getProcessByDueDateInFlow - no minDate and maxDate (412)', async () => {
    reqMock.query = { offset: 5, limit: 10 };
    reqMock.params = {};

    await statisticsController.getProcessByDueDateInFlow(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(412);
    expect(resMock.json).toHaveBeenCalledWith({
      error: 'É necessário indicar o período de vencimento!',
    });
  });
});
