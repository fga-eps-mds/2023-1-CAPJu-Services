import { ProcessAudController } from '../../../src/controllers/processAud.js';
import * as utils from '../../../middleware/authMiddleware.js';

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('ProcessAudController', () => {
  let processAudController;

  beforeEach(() => {
    processAudController = new ProcessAudController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

describe('findAllPaged', () => {  
    test('Status - 200', async () => {
        const mockProcessAud = [{
          id: 1,
          idProcess: 1,
          processRecord: 1234567890,
          operation: 'INSERT',
          changedAt: '12/12/2022',
          changedBy: '12345678901',
          oldValues: '',
          newValues: '{\"idStage\":null,\"status\":\"notStarted\",\"idProcess\":3659,\"record\":\"16996097420235058389\",\"idUnit\":1,\"nickname\":\"processo 02\",\"idFlow\":10,\"idPriority\":0,\"finalised\":false,\"updatedAt\":\"2023-12-10T15:43:59.828Z\",\"createdAt\":\"2023-12-10T15:43:59.828Z\",\"effectiveDate\":null}'
        }]

        processAudController.processAudService.findAllPaged = jest
        .fn()
        .mockResolvedValue(mockProcessAud);
        
        await processAudController.findAllPaged(reqMock, resMock);
        
        expect(resMock.json).toHaveBeenCalledWith(mockProcessAud);
        expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('Status - 500', async () => {
      const mockProcessAud = new Error('Internal Server Error')

      processAudController.processAudService.findAllPaged = jest
      .fn()
      .mockRejectedValue(mockProcessAud);
      
      await processAudController.findAllPaged(reqMock, resMock);
      
      expect(resMock.json).toHaveBeenCalledWith({ error: `${mockProcessAud}`, message: `Erro ao buscar histórico` });
      expect(resMock.status).toHaveBeenCalledWith(500);
  });
})

describe('findAll', () => {  
    test('Status - 200', async () => {
        const mockProcessAud = [{
          id: 1,
          idProcess: 1,
          processRecord: 1234567890,
          operation: 'INSERT',
          changedAt: '12/12/2022',
          changedBy: '12345678901',
          oldValues: '',
          newValues: '{\"idStage\":null,\"status\":\"notStarted\",\"idProcess\":3659,\"record\":\"16996097420235058389\",\"idUnit\":1,\"nickname\":\"processo 02\",\"idFlow\":10,\"idPriority\":0,\"finalised\":false,\"updatedAt\":\"2023-12-10T15:43:59.828Z\",\"createdAt\":\"2023-12-10T15:43:59.828Z\",\"effectiveDate\":null}'
        }]

        processAudController.processAudService.findAll = jest
        .fn()
        .mockResolvedValue(mockProcessAud);
        
        await processAudController.findAll(reqMock, resMock);
        
        expect(resMock.json).toHaveBeenCalledWith(mockProcessAud);
        expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('Status - 500', async () => {
      const mockProcessAud = new Error('Internal Server Error')

      processAudController.processAudService.findAll = jest
      .fn()
      .mockRejectedValue(mockProcessAud);
      
      await processAudController.findAll(reqMock, resMock);
      
      expect(resMock.json).toHaveBeenCalledWith({ error: `${mockProcessAud}`, message: `Erro ao buscar histórico` });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });   
})

describe('generateXlsx', () => {  
    test('Status - 200', async () => {
        const mockProcessAud = [{
          id: 1,
          idProcess: 1,
          processRecord: 1234567890,
          operation: 'INSERT',
          changedAt: '12/12/2022',
          changedBy: '12345678901',
          oldValues: '',
          newValues: '{\"idStage\":null,\"status\":\"notStarted\",\"idProcess\":3659,\"record\":\"16996097420235058389\",\"idUnit\":1,\"nickname\":\"processo 02\",\"idFlow\":10,\"idPriority\":0,\"finalised\":false,\"updatedAt\":\"2023-12-10T15:43:59.828Z\",\"createdAt\":\"2023-12-10T15:43:59.828Z\",\"effectiveDate\":null}'
        }]

        processAudController.processAudService.generateXlsx = jest
        .fn()
        .mockResolvedValue(mockProcessAud);
        
        await processAudController.generateXlsx(reqMock, resMock);
        
        expect(resMock.json).toHaveBeenCalledWith(mockProcessAud);
        expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test('Status - 500', async () => {
      const mockProcessAud = new Error('Internal Server Error')

      processAudController.processAudService.generateXlsx = jest
      .fn()
      .mockRejectedValue(mockProcessAud);
      
      await processAudController.generateXlsx(reqMock, resMock);
      
      expect(resMock.json).toHaveBeenCalledWith({ error: `${mockProcessAud}`, message: `Erro ao gerar excel` });
      expect(resMock.status).toHaveBeenCalledWith(500);
    });   
})
});
