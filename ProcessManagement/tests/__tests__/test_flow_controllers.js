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
    
    test('error retrieving flow (500)', async () => {
      flowController.flowService.findOneByFlowId = jest
        .fn()
        .mockRejectedValue(new Error('Error retrieving flow'));

      reqMock.params = { idFlow: 1 };

      await flowController.showByFlowId(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: new Error('Error retrieving flow'),
        message: 'Impossível obter fluxo 1',
      });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });

  describe('showByFlowIdWithSequence', () => {
    test('flow with sequences found (200)', async () => {
      const mockFlow = { idFlow: 1, name: 'Flow 1', idUnit: 1 };
      const mockFlowStages = [
        { idStageA: 1, idStageB: 2, commentary: 'Commentary 1' },
        { idStageA: 2, idStageB: 3, commentary: 'Commentary 2' },
      ];

      flowController.flowService.findOneByFlowId = jest
        .fn()
        .mockResolvedValue(mockFlow);
      flowController.flowStageService.findAllByIdFlow = jest
        .fn()
        .mockResolvedValue(mockFlowStages);

      reqMock.params = { idFlow: 1 };

      await flowController.showByFlowIdWithSequence(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        idFlow: 1,
        name: 'Flow 1',
        idUnit: 1,
        sequences: [
          { from: 1, commentary: 'Commentary 1', to: 2 },
          { from: 2, commentary: 'Commentary 2', to: 3 },
        ],
      });
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('flow not found (404)', async () => {
      flowController.flowService.findOneByFlowId = jest.fn().mockResolvedValue(null);

      reqMock.params = { idFlow: 1 };

      await flowController.showByFlowIdWithSequence(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({ message: `Fluxo 1 não existe` });
      expect(resMock.status).toHaveBeenCalledWith(404);
    });

    test('flow with no sequences (404)', async () => {
      flowController.flowService.findOneByFlowId = jest.fn().mockResolvedValue({ idFlow: 1 });

      flowController.flowStageService.findAllByIdFlow = jest.fn().mockResolvedValue([]);

      reqMock.params = { idFlow: 1 };

      await flowController.showByFlowIdWithSequence(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({ message: `Fluxo 1 não tem sequências` });
      expect(resMock.status).toHaveBeenCalledWith(404);
    });

    test('error retrieving sequences (500)', async () => {
      flowController.flowService.findOneByFlowId = jest
        .fn()
        .mockRejectedValue(new Error('Error retrieving flow'));

      reqMock.params = { idFlow: 1 };

      await flowController.showByFlowIdWithSequence(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: new Error('Error retrieving flow'),
        message: 'Impossível ler sequências',
      });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });

  describe('showUsersToNotify', () => {
    test('get users to notify successfully (200)', async () => {
      const mockResult = ['user1', 'user2'];

      flowController.flowUserService.findUsersToNotify = jest
        .fn()
        .mockResolvedValue(mockResult);

      reqMock.params = { idFlow: 1 };

      await flowController.showUsersToNotify(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({ usersToNotify: mockResult });
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('error retrieving users to notify (500)', async () => {
      flowController.flowUserService.findUsersToNotify = jest
        .fn()
        .mockRejectedValue(new Error('Error retrieving users to notify'));

      reqMock.params = { idFlow: 1 };

      await flowController.showUsersToNotify(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: new Error('Error retrieving users to notify'),
        message: 'Impossível obter usuários que devem ser notificados no fluxo',
      });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });

  describe('store', () => {
    test('create flow successfully (200)', async () => {
      const mockRequestBody = {
        name: 'Flow 1',
        idUnit: 1,
        sequences: [
          { from: 1, to: 2, commentary: 'Commentary 1' },
          { from: 2, to: 3, commentary: 'Commentary 2' },
        ],
        idUsersToNotify: ['user1', 'user2'],
      };

      const mockFlow = { idFlow: 1, name: 'Flow 1' };

      flowController.flowService.createFlow = jest.fn().mockResolvedValue(mockFlow);

      flowController.flowStageService.createFlowStage = jest.fn();

      flowController.flowUserService.createFlowUser = jest.fn();

      axios.get = jest.fn().mockResolvedValue({ data: {} });

      reqMock.body = mockRequestBody;

      await flowController.store(reqMock, resMock);

      expect(flowController.flowService.createFlow).toHaveBeenCalledWith({
        name: 'Flow 1',
        idUnit: 1,
      });

      expect(flowController.flowStageService.createFlowStage).toHaveBeenCalledTimes(2);
      expect(flowController.flowStageService.createFlowStage).toHaveBeenCalledWith({
        idFlow: 1,
        idStageA: 1,
        idStageB: 2,
        commentary: 'Commentary 1',
      });
      expect(flowController.flowStageService.createFlowStage).toHaveBeenCalledWith({
        idFlow: 1,
        idStageA: 2,
        idStageB: 3,
        commentary: 'Commentary 2',
      });

      expect(flowController.flowUserService.createFlowUser).toHaveBeenCalledTimes(2);
      expect(flowController.flowUserService.createFlowUser).toHaveBeenCalledWith('user1', 1);
      expect(flowController.flowUserService.createFlowUser).toHaveBeenCalledWith('user2', 1);

      expect(resMock.json).toHaveBeenCalledWith({
        idFlow: 1,
        name: 'Flow 1',
        idUnit: 1,
        sequences: [
          { from: 1, to: 2, commentary: 'Commentary 1' },
          { from: 2, to: 3, commentary: 'Commentary 2' },
        ],
        usersToNotify: ['user1', 'user2'],
      });
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('user does not exist in unit (404)', async () => {
      const mockRequestBody = {
        name: 'Flow 1',
        idUnit: 1,
        sequences: [
          { from: 1, to: 2, commentary: 'Commentary 1' },
          { from: 2, to: 3, commentary: 'Commentary 2' },
        ],
        idUsersToNotify: ['user1', 'user2'],
      };

      flowController.flowService.createFlow = jest.fn().mockResolvedValue({ idFlow: 1 });

      axios.get = jest.fn().mockResolvedValue({ data: null });

      reqMock.body = mockRequestBody;

      await flowController.store(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        message: "Usuário 'user1' não existe na unidade '1'",
      });
      expect(resMock.status).toHaveBeenCalledWith(404);
    });
  });
});