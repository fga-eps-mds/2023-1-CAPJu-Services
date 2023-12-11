import { ProcessesFileController } from '../../../src/controllers/processesFile.js';
import * as utils from '../../../middleware/authMiddleware.js';

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('ProcessesFileController', () => {
  let processesFileController;

  beforeEach(() => {
    processesFileController = new ProcessesFileController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllPaged', () => {
    test('Status - 200', async () => {
      const mockProcessFile = [
        {
          idProcessFile: 1,
          name: 'teste',
          status: 'failed',
          importedBy: 12345678901,
          createdAt: '12/12/2022',
          importedAt: '12/12/2022',
          fileName: 'filename.csv',
        },
      ];

      processesFileController.processesFileService.findAllPaged = jest
        .fn()
        .mockResolvedValue(mockProcessFile);

      await processesFileController.findAllPaged(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(mockProcessFile);
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('Status - 500', async () => {
      const mockProcessFile = new Error('Internal Server Error');

      processesFileController.processesFileService.findAllPaged = jest
        .fn()
        .mockRejectedValue(mockProcessFile);

      await processesFileController.findAllPaged(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: `${mockProcessFile}`,
        message: `Erro ao buscar arquivos`,
      });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });

  describe('findAllItemsPaged', () => {
    test('Status - 200', async () => {
      const mockProcessFile = [
        {
          idProcessFile: 1,
          name: 'teste',
          status: 'failed',
          importedBy: 12345678901,
          createdAt: '12/12/2022',
          importedAt: '12/12/2022',
          fileName: 'filename.csv',
        },
      ];

      processesFileController.processesFileService.findAllItemsPaged = jest
        .fn()
        .mockResolvedValue(mockProcessFile);

      await processesFileController.findAllItemsPaged(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(mockProcessFile);
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('Status - 500', async () => {
      const mockProcessFile = new Error('Internal Server Error');

      processesFileController.processesFileService.findAllItemsPaged = jest
        .fn()
        .mockRejectedValue(mockProcessFile);

      await processesFileController.findAllItemsPaged(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: `${mockProcessFile}`,
        message: `Erro ao buscar items`,
      });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });

  describe('create', () => {
    test('Status - 200', async () => {
      const mockProcessFile = {
        error:
          "TypeError: Cannot read properties of undefined (reading 'authorization')",
        message: 'Erro ao salvar remessa de processos',
      };

      processesFileController.processesFileService.create = jest
        .fn()
        .mockResolvedValue(mockProcessFile);

      await processesFileController.create(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(mockProcessFile);
      expect(resMock.status).toHaveBeenCalledWith(500);
    });

    test('Status - 500', async () => {
      const mockProcessFileError = {
        error:
          "TypeError: Cannot read properties of undefined (reading 'authorization')",
        message: 'Erro ao salvar remessa de processos',
      };

      processesFileController.processesFileService.create = jest
        .fn()
        .mockRejectedValue(mockProcessFileError);

      await processesFileController.create(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(mockProcessFileError);
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateFileItem', () => {
    test('Status - 200', async () => {
      const mockProcessFile = {
        idProcessFile: 1,
        name: 'teste',
        status: 'failed',
        importedBy: 12345678901,
        importedAt: '12/12/2022',
        fileName: 'filename.csv',
      };
      const params = { idProcessFile: 1 };
      const body = {
        idProcessFile: 1,
        name: 'teste',
        status: 'failed',
        importedBy: 12345678901,
        importedAt: '12/12/2022',
        fileName: 'filename.csv',
      };

      reqMock.body = body;
      reqMock.params = params;
      resMock.json = jest.fn().mockResolvedValue(mockProcessFile);
      resMock.status = jest.fn(() => resMock);

      processesFileController.processesFileService.updateFileItem = jest
        .fn()
        .mockResolvedValue([mockProcessFile.idProcessFile]);

      const result = await processesFileController.updateFileItem(
        reqMock,
        resMock,
      );

      expect(result).toEqual(mockProcessFile);
    });

    test('Status - 500', async () => {
      const mockProcessFileError = new Error('Internal Server Error');

      processesFileController.processesFileService.updateFileItem = jest
        .fn()
        .mockRejectedValue(mockProcessFileError);

      await processesFileController.updateFileItem(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Error: Internal Server Error',
        message: 'Erro ao atualizar item',
      });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });

  describe('findFileById', () => {
    test('Status - 200', async () => {
      const mockProcessFile = {
        idProcessFile: 1,
        name: 'teste',
        status: 'failed',
        importedBy: 12345678901,
        importedAt: '12/12/2022',
        fileName: 'filename.csv',
      };
      const params = { idProcessFile: 1 };
      const body = {
        idProcessFile: 1,
        name: 'teste',
        status: 'failed',
        importedBy: 12345678901,
        importedAt: '12/12/2022',
        fileName: 'filename.csv',
      };

      reqMock.body = body;
      reqMock.params = params;
      resMock.json = jest.fn().mockResolvedValue(mockProcessFile);
      resMock.status = jest.fn(() => resMock);

      processesFileController.processesFileService.findFileById = jest
        .fn()
        .mockResolvedValue([mockProcessFile.idProcessFile]);

      const result = await processesFileController.findFileById(
        reqMock,
        resMock,
      );

      expect(result).toEqual(mockProcessFile);
    });

    test('Status - 500', async () => {
      const mockProcessFileError = new Error('Internal Server Error');

      processesFileController.processesFileService.findFileById = jest
        .fn()
        .mockRejectedValue(mockProcessFileError);

      await processesFileController.findFileById(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Error: Internal Server Error',
        message: 'Erro ao salvar remessa de processos',
      });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });

  describe('findById', () => {
    test('Status - 200', async () => {
      const mockProcessFile = {
        idProcessFile: 1,
        name: 'teste',
        status: 'failed',
        importedBy: 12345678901,
        importedAt: '12/12/2022',
        fileName: 'filename.csv',
      };
      const params = { idProcessFile: 1 };
      const body = {
        idProcessFile: 1,
        name: 'teste',
        status: 'failed',
        importedBy: 12345678901,
        importedAt: '12/12/2022',
        fileName: 'filename.csv',
      };

      reqMock.body = body;
      reqMock.params = params;
      resMock.json = jest.fn().mockResolvedValue(mockProcessFile);
      resMock.status = jest.fn(() => resMock);

      processesFileController.processesFileService.findById = jest
        .fn()
        .mockResolvedValue([mockProcessFile.idProcessFile]);

      const result = await processesFileController.findById(reqMock, resMock);

      expect(result).toEqual(mockProcessFile);
    });

    test('Status - 500', async () => {
      const mockProcessFileError = new Error('Internal Server Error');

      processesFileController.processesFileService.findById = jest
        .fn()
        .mockRejectedValue(mockProcessFileError);

      await processesFileController.findById(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Error: Internal Server Error',
        message: 'Erro ao salvar remessa de processos',
      });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });
});
