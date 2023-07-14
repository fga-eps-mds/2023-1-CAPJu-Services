import 'dotenv/config';
import axios from 'axios';
import { ProcessController } from '../../src/controllers/process';

jest.mock('axios');

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('ProcessController', () => {
  let processController;

  beforeEach(() => {
    processController = new ProcessController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('index', () => {
    test('list all processes (200)', async () => {
      const mockProcesses = [{ id: 1, name: 'Process 1' }, { id: 2, name: 'Process 2' }];

      processController.processService.getAllProcess = jest.fn().mockResolvedValue(mockProcesses);

      await processController.index(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(mockProcesses);
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('no processes found (404)', async () => {
      processController.processService.getAllProcess = jest.fn().mockResolvedValue(null);

      await processController.index(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({ message: 'Não Existem processos cadatrados' });
      expect(resMock.status).toHaveBeenCalledWith(404);
    });

    test('internal server error (500)', async () => {
      const error = new Error('Internal Server Error');
      processController.processService.getAllProcess = jest.fn().mockRejectedValue(error);

      await processController.index(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({ message: 'Erro ao buscar processos' });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getProcessByRecord', () => {
    test('process found (200)', async () => {
      const mockProcess = { id: 1, name: 'Process 1' };

      processController.processService.getProcessByRecord = jest.fn().mockResolvedValue(mockProcess);

      reqMock.params = { record: '123' };

      await processController.getProcessByRecord(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(mockProcess);
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('process not found (404)', async () => {
      processController.processService.getProcessByRecord = jest.fn().mockResolvedValue(null);

      reqMock.params = { record: '123' };

      await processController.getProcessByRecord(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Esse processo não existe!',
        message: 'Esse processo não existe!',
      });
      expect(resMock.status).toHaveBeenCalledWith(404);
    });

    test('internal server error (500)', async () => {
      const error = new Error('Internal Server Error');
      processController.processService.getProcessByRecord = jest.fn().mockRejectedValue(error);

      reqMock.params = { record: '123' };

      await processController.getProcessByRecord(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: `${error}`,
        message: `Erro ao procurar processo`,
      });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getProcessByIdFlow', () => {
    test('processes found (200)', async () => {
      const mockProcesses = [{ id: 1, name: 'Process 1' }, { id: 2, name: 'Process 2' }];

      processController.processService.getProcessByIdFlow = jest.fn().mockResolvedValue(mockProcesses);

      reqMock.params = { idFlow: 1 };

      await processController.getProcessByIdFlow(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(mockProcesses);
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('no processes found (404)', async () => {
      processController.processService.getProcessByIdFlow = jest.fn().mockResolvedValue(null);

      reqMock.params = { idFlow: 1 };

      await processController.getProcessByIdFlow(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Processos não encontrados nesse fluxo!',
        message: 'Processos não encontrados nesse fluxo!',
      });
      expect(resMock.status).toHaveBeenCalledWith(404);
    });

    test('internal server error (500)', async () => {
      const error = new Error('Internal Server Error');
      processController.processService.getProcessByIdFlow = jest.fn().mockRejectedValue(error);

      reqMock.params = { idFlow: 1 };

      await processController.getProcessByIdFlow(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error,
        message: `Erro ao procurar processo.`,
      });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getProcessByUniqueKeys', () => {
    test('process found (200)', async () => {
      const mockProcess = { id: 1, name: 'Process 1' };

      processController.processService.getProcessByUniqueKeys = jest
        .fn()
        .mockResolvedValue(mockProcess);

      reqMock.params = { record: '123', idFlow: 1 };

      await processController.getProcessByUniqueKeys(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(mockProcess);
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('process not found (404)', async () => {
      processController.processService.getProcessByUniqueKeys = jest.fn().mockResolvedValue(null);

      reqMock.params = { record: '123', idFlow: 1 };

      await processController.getProcessByUniqueKeys(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Esse processo não existe nesse fluxo!',
        message: 'Esse processo não existe nesse fluxo!',
      });
      expect(resMock.status).toHaveBeenCalledWith(404);
    });

    test('internal server error (500)', async () => {
      const error = new Error('Internal Server Error');
      processController.processService.getProcessByUniqueKeys = jest
        .fn()
        .mockRejectedValue(error);

      reqMock.params = { record: '123', idFlow: 1 };

      await processController.getProcessByUniqueKeys(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error,
        message: `Erro ao procurar processo nesse fluxo`,
      });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });
  describe('store', () => {
    test('create process successfully (200)', async () => {
      const mockFlow = { idFlow: 1, idUnit: 1 };
      const mockRecordStatus = { valid: true, filteredRecord: '123' };

      processController.processService.validateRecord = jest.fn().mockReturnValue(mockRecordStatus);
      processController.flowService.findOneByFlowId = jest.fn().mockResolvedValue(mockFlow);
      processController.processService.createProcess = jest.fn();

      reqMock.body = {
        record: '123',
        nickname: 'John Doe',
        idPriority: 1,
        idFlow: 1,
        idStage: 1,
      };

      await processController.store(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        message: `Processo criado com sucesso.`,
      });
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('invalid record format (400)', async () => {
      const mockRecordStatus = { valid: false, filteredRecord: 'abc' };

      processController.processService.validateRecord = jest.fn().mockReturnValue(mockRecordStatus);

      reqMock.body = {
        record: 'abc',
        nickname: 'John Doe',
        idPriority: 1,
        idFlow: 1,
        idStage: 1,
      };

      await processController.store(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Registro fora do padrão CNJ',
        message: `Registro 'abc' está fora do padrão CNJ`,
      });
      expect(resMock.status).toHaveBeenCalledWith(400);
    });

    test('flow not found (500)', async () => {
      const mockRecordStatus = { valid: true, filteredRecord: '123' };

      processController.processService.validateRecord = jest.fn().mockReturnValue(mockRecordStatus);
      processController.flowService.findOneByFlowId = jest.fn().mockRejectedValue(new Error('Flow not found'));

      reqMock.body = {
        record: '123',
        nickname: 'John Doe',
        idPriority: 1,
        idFlow: 1,
        idStage: 1,
      };

      await processController.store(reqMock, resMock);
      
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Error: Flow not found',
        message: 'Erro ao buscar fluxo por idFlow.',
      });
      
      expect(resMock.status).toHaveBeenCalledWith(500);
    });

  describe('getPriorityProcess', () => {
    test('list priority processes (200)', async () => {
      const mockPriorityProcesses = [{ id: 1, name: 'Process 1' }, { id: 2, name: 'Process 2' }];

      processController.processService.getPriorityProcess = jest
        .fn()
        .mockResolvedValue(mockPriorityProcesses);

      await processController.getPriorityProcess(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(mockPriorityProcesses);
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('no priority processes found (404)', async () => {
      processController.processService.getPriorityProcess = jest.fn().mockResolvedValue(null);

      await processController.getPriorityProcess(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({ error: 'Não há processos com prioridade legal.' });
      expect(resMock.status).toHaveBeenCalledWith(404);
    });

    test('internal server error (500)', async () => {
      const error = new Error('Internal Server Error');
      processController.processService.getPriorityProcess = jest.fn().mockRejectedValue(error);

      await processController.getPriorityProcess(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(error);
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });
  describe('updateProcess', () => {
    test('update process successfully (200)', async () => {
      const mockRecordStatus = { valid: true, filteredRecord: '123' };
      const mockProcess = { id: 1, record: '123', nickname: 'John Doe', status: 'notStarted' };
      const mockFlowStages = [{ idStageA: 1 }];
      const mockUpdatedProcess = { id: 1, record: '123', nickname: 'John Doe', status: 'inProgress' };

      processController.processService.validateRecord = jest.fn().mockReturnValue(mockRecordStatus);
      processController.processService.getProcessByRecord = jest.fn().mockResolvedValue(mockProcess);
      processController.flowStageService.findAllByIdFlow = jest.fn().mockResolvedValue(mockFlowStages);
      processController.processService.updateProcess = jest.fn().mockResolvedValue(mockUpdatedProcess);

      reqMock.params = { record: '123' };
      reqMock.body = { nickname: 'Jane Doe', status: 'inProgress' };

      await processController.updateProcess(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(mockUpdatedProcess);
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('invalid record format (400)', async () => {
      const mockRecordStatus = { valid: false, filteredRecord: 'abc' };

      processController.processService.validateRecord = jest.fn().mockReturnValue(mockRecordStatus);

      reqMock.params = { record: 'abc' };
      reqMock.body = { nickname: 'John Doe', status: 'inProgress' };

      await processController.updateProcess(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Registro fora do padrão CNJ',
        message: `Registro 'abc' está fora do padrão CNJ`,
      });
      expect(resMock.status).toHaveBeenCalledWith(400);
    });

    test('process not found (500)', async () => {
      const mockRecordStatus = { valid: true, filteredRecord: '123' };

      processController.processService.validateRecord = jest.fn().mockReturnValue(mockRecordStatus);
      processController.processService.getProcessByRecord = jest.fn().mockRejectedValue(new Error('Process not found'));

      reqMock.params = { record: '123' };
      reqMock.body = { nickname: 'John Doe', status: 'inProgress' };

      await processController.updateProcess(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({ error: 'Falha ao buscar processo.' });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });

    test('no stages in flow (404)', async () => {
      const mockRecordStatus = { valid: true, filteredRecord: '123' };
      const mockProcess = { id: 1, record: '123', nickname: 'John Doe', status: 'notStarted' };
      const mockFlowStages = [];

      processController.processService.validateRecord = jest.fn().mockReturnValue(mockRecordStatus);
      processController.processService.getProcessByRecord = jest.fn().mockResolvedValue(mockProcess);
      processController.flowStageService.findAllByIdFlow = jest.fn().mockResolvedValue(mockFlowStages);

      reqMock.params = { record: '123' };
      reqMock.body = { nickname: 'John Doe', status: 'inProgress' };

      await processController.updateProcess(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({ error: 'Não há etapas neste fluxo' });
      expect(resMock.status).toHaveBeenCalledWith(404);
    });

    test('starting process not valid (200)', async () => {
      const mockRecordStatus = { valid: true, filteredRecord: '123' };
      const mockProcess = { id: 1, record: '123', nickname: 'John Doe', status: 'inProgress' };
      const mockFlowStages = [{ idStageA: 1 }];

      processController.processService.validateRecord = jest.fn().mockReturnValue(mockRecordStatus);
      processController.processService.getProcessByRecord = jest.fn().mockResolvedValue(mockProcess);
      processController.flowStageService.findAllByIdFlow = jest.fn().mockResolvedValue(mockFlowStages);

      reqMock.params = { record: '123' };
      reqMock.body = { nickname: 'John Doe', status: 'inProgress' };

      await processController.updateProcess(reqMock, resMock);
      
      expect(resMock.json).toHaveBeenCalledWith({
        id: 1,
        nickname: 'John Doe',
        record: '123',
        status: 'inProgress',
      });
      
      expect(resMock.status).toHaveBeenCalledWith(200);
    });
  });
});

});
