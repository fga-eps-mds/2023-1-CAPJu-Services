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
        const mockProcessFile = [{
          idProcessFile: 1,
          name: "teste",
          status: "failed",
          importedBy: 12345678901,
          createdAt: "12/12/2022",
          importedAt: "12/12/2022",
          fileName: "filename.csv",
        }]

        processesFileController.processesFileService.findAllPaged = jest
        .fn()
        .mockResolvedValue(mockProcessFile);
        
        await processesFileController.findAllPaged(reqMock, resMock);
        
        expect(resMock.json).toHaveBeenCalledWith(mockProcessFile);
        expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('Status - 500', async () => {
      const mockProcessFile = new Error('Internal Server Error')

      processesFileController.processesFileService.findAllPaged = jest
      .fn()
      .mockRejectedValue(mockProcessFile);
      
      await processesFileController.findAllPaged(reqMock, resMock);
      
      expect(resMock.json).toHaveBeenCalledWith({ error: `${mockProcessFile}`, message: `Erro ao buscar arquivos` });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
})
});
