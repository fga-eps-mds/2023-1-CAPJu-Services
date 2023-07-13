import 'dotenv/config';
import axios from 'axios';
import { FlowController } from '../../src/controllers/flow.js';

//jest.mock('../services/_index.js');
jest.mock('axios');

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('FlowController', () => {
  let flowController;

  beforeEach(() => {
    flowController = new FlowController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('index - list all flows with sequences (200)', async () => {
    const mockFlows = [
      { idFlow: 1, name: 'Flow 1', idUnit: 1 },
      { idFlow: 2, name: 'Flow 2', idUnit: 1 },
    ];
    const mockFlowStages = [
      { idStageA: 1, idStageB: 2 },
      { idStageA: 3, idStageB: 4 },
    ];
    const mockStages = [
      { idStage: 1, name: 'Stage 1' },
      { idStage: 2, name: 'Stage 2' },
      { idStage: 3, name: 'Stage 3' },
      { idStage: 4, name: 'Stage 4' },
    ];
    const mockSequences = [
      { from: 1, to: 2 },
      { from: 3, to: 4 },
    ];

    flowController.flowService.findAll = jest.fn().mockResolvedValue(mockFlows);
    flowController.flowStageService.findAllByIdFlow = jest
      .fn()
      .mockResolvedValue(mockFlowStages);
    flowController.flowService.stagesSequencesFromFlowStages = jest
      .fn()
      .mockResolvedValue({ stages: mockStages, sequences: mockSequences });

    await flowController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith([
      {
        idFlow: 1,
        name: 'Flow 1',
        idUnit: 1,
        stages: mockStages,
        sequences: mockSequences,
      },
      {
        idFlow: 2,
        name: 'Flow 2',
        idUnit: 1,
        stages: mockStages,
        sequences: mockSequences,
      },
    ]);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('index - internal server error (500)', async () => {
    const error = new Error('Internal Server Error');
    flowController.flowService.findAll = jest.fn().mockRejectedValue(error);

    await flowController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error,
      message: 'Impossível obter fluxos',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test('showByProcessRecord - flows found (200)', async () => {
    const mockFlowProcesses = [{ id: 1, name: 'Flow 1' }];

    flowController.processService.getProcessByRecord = jest
      .fn()
      .mockResolvedValue(mockFlowProcesses);

    reqMock.params = { record: '123' };

    await flowController.showByProcessRecord(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(mockFlowProcesses);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('showByProcessRecord - no flows found (200)', async () => {
    const mockFlowProcesses = [];

    flowController.processService.getProcessByRecord = jest
      .fn()
      .mockResolvedValue(mockFlowProcesses);

    reqMock.params = { record: '123' };

    await flowController.showByProcessRecord(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Não há fluxos com o processo',
    });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('showByProcessRecord - internal server error (500)', async () => {
    const error = new Error('Internal Server Error');
    flowController.processService.getProcessByRecord = jest
      .fn()
      .mockRejectedValue(error);

    reqMock.params = { record: '123' };

    await flowController.showByProcessRecord(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error,
      message: 'Erro ao buscar fluxos do processo',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

 

});
