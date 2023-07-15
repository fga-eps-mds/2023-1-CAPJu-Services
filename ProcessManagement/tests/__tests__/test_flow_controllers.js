import 'dotenv/config';
import axios from 'axios';
import { FlowController } from '../../src/controllers/flow.js';

jest.mock('axios');


const reqMock = {
  body: {
    name: 'Flow Test',
    idUnit: '1',
    sequences: [
      { from: '1', to: '2', commentary: 'Sequence 1' },
      { from: '4', to: '3', commentary: 'Sequence 2' },
      { from: '3', to: '5', commentary: 'Sequence 3' },
    ],
    idUsersToNotify: ['user1', 'user2'],
  },
  params: {
    idFlow: '1',
  },
};

reqMock.body = {
  name: 'Flow 1',
  idUnit: 1,
  sequences: [
    { from: 1, to: 2 },
    { from: 2, to: 3 }
  ],
  idUsersToNotify: ['user1', 'user2']
};



describe('FlowController', () => {
  let flowController;
  let reqMock;
  let resMock;

  beforeEach(() => {
    flowController = new FlowController();
    reqMock = {};
    resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('index', () => {
    test('get all flows successfully (200)', async () => {
      const mockFlows = [
        { idFlow: 1, name: 'Flow 1', idUnit: 1 },
        { idFlow: 2, name: 'Flow 2', idUnit: 2 },
      ];
      const mockFlowStages = [
        { idStage: 1, name: 'Stage 1' },
        { idStage: 2, name: 'Stage 2' },
      ];
      const mockSequences = [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
      ];

      flowController.flowService.findAll = jest.fn().mockResolvedValue(mockFlows);
      flowController.flowStageService.findAllByIdFlow = jest
        .fn()
        .mockResolvedValue(mockFlowStages);
      flowController.flowService.stagesSequencesFromFlowStages = jest
        .fn()
        .mockResolvedValue({ stages: mockFlowStages, sequences: mockSequences });

      await flowController.index(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith([
        {
          idFlow: 1,
          name: 'Flow 1',
          idUnit: 1,
          stages: mockFlowStages,
          sequences: mockSequences,
        },
        {
          idFlow: 2,
          name: 'Flow 2',
          idUnit: 2,
          stages: mockFlowStages,
          sequences: mockSequences,
        },
      ]);
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('error retrieving flows (500)', async () => {
      flowController.flowService.findAll = jest.fn().mockRejectedValue(new Error('Error retrieving flows'));

      await flowController.index(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: new Error('Error retrieving flows'),
        message: 'Impossível obter fluxos',
      });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });

  describe('showByProcessRecord', () => {
    test('processes found for record (200)', async () => {
      const mockFlowProcesses = [
        { idProcess: 1, record: '123' },
        { idProcess: 2, record: '123' },
      ];

      flowController.processService.getProcessByRecord = jest
        .fn()
        .mockResolvedValue(mockFlowProcesses);

      reqMock.params = { record: '123' };

      await flowController.showByProcessRecord(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(mockFlowProcesses);
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('no processes found for record (200)', async () => {
      const mockFlowProcesses = [];

      flowController.processService.getProcessByRecord = jest
        .fn()
        .mockResolvedValue(mockFlowProcesses);

      reqMock.params = { record: '123' };

      await flowController.showByProcessRecord(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({ message: 'Não há fluxos com o processo' });
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('error retrieving processes (500)', async () => {
      flowController.processService.getProcessByRecord = jest
        .fn()
        .mockRejectedValue(new Error('Error retrieving processes'));

      reqMock.params = { record: '123' };

      await flowController.showByProcessRecord(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: new Error('Error retrieving processes'),
        message: 'Erro ao buscar fluxos do processo',
      });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });

  describe('showByFlowId', () => {
    test('flow found (200)', async () => {
      const mockFlow = { idFlow: 1, name: 'Flow 1', idUnit: 1 };
      const mockFlowStages = [
        { idStage: 1, name: 'Stage 1' },
        { idStage: 2, name: 'Stage 2' },
      ];
      const mockSequences = [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
      ];

      flowController.flowService.findOneByFlowId = jest
        .fn()
        .mockResolvedValue(mockFlow);
      flowController.flowStageService.findAllByIdFlow = jest
        .fn()
        .mockResolvedValue(mockFlowStages);
      flowController.flowService.stagesSequencesFromFlowStages = jest
        .fn()
        .mockResolvedValue({ stages: mockFlowStages, sequences: mockSequences });

      reqMock.params = { idFlow: 1 };

      await flowController.showByFlowId(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        idFlow: 1,
        name: 'Flow 1',
        idUnit: 1,
        stages: mockFlowStages,
        sequences: mockSequences,
      });
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('flow not found (404)', async () => {
      flowController.flowService.findOneByFlowId = jest.fn().mockResolvedValue(null);

      reqMock.params = { idFlow: 1 };

      await flowController.showByFlowId(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({ message: `Não há fluxo '1'` });
      expect(resMock.status).toHaveBeenCalledWith(404);
    });
  });
});