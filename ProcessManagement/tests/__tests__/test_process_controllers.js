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

});
