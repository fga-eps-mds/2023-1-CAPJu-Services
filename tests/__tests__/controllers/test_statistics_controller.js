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
});
