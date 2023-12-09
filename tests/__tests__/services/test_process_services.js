import services from '../../../src/services/_index';
import ProcessService, { validateRecord } from '../../../src/services/process';
import ProcessAudService from '../../../src/services/processAudService';
import { Op } from 'sequelize';

const ProcessAudModel = {
  create: jest.fn(),
};

const ProcessModel = {
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  processAud: {
    create: jest.fn(),
  },
};

describe('ProcessService', () => {
  let processService;
  let reqMock;
  let resMock;

  beforeEach(() => {
    processService = new ProcessService(ProcessModel);
    reqMock = {};
    resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  })

  afterEach(() => {
    jest.clearAllMocks();
  });

  // describe('createProcess', () => {
  //   it('Criar um novo processo com os parâmetros fornecidos', async () => {
  //     const params = { record: '1234567890', idFlow: 1 };

  //     ProcessModel.create.mockResolvedValue(params);
  //     ProcessModel.processAud.create.mockResolvedValue([]);

  //     const result = await services.processService.createProcessAndAud(params);

  //     expect(result).toEqual(params);
  //     expect(ProcessModel.create).toHaveBeenCalledWith(params);
  //   });
  // });

  describe('updateProcess', () => {
    it('Atualizar um processo com os parâmetros e registro fornecidos', async () => {
      const params = { idProcess: 1 };
      const body = { idProcess: 1, nickname: "processo 1", record: '1234567890', priority: 1, idFlow: 1, status: 'inProgress' };

      const originalProcess = { idProcess: 1, nickname: "processo 1", record: '1234567890', priority: 1, idFlow: 1, status: 'notStarted' };
      const updatedProcess = { ...params, status: 'updated' };

      reqMock.body = body
      reqMock.params = params

      processService.getProcessById = jest.fn().mockResolvedValue(originalProcess);
      processService.flowStageService.findAllByIdFlow = jest.fn().mockResolvedValue([ updatedProcess ]);
      processService.executeUpdateQuery = jest.fn().mockResolvedValue(updatedProcess);

      const result = await processService.updateProcess(reqMock, resMock);

      expect(result).toEqual(updatedProcess);
      expect(processService.getProcessById).toHaveBeenCalled();
      expect(processService.flowStageService.findAllByIdFlow).toHaveBeenCalled();
      expect(processService.executeUpdateQuery).toHaveBeenCalled();
    });

    it('Atualizar um processo inexistente', async () => {
      const params = { idProcess: 1, nickname: "processo 1", record: '1234567890', priority: 1, idFlow: 1 };
      const body = { idProcess: 1, nickname: "processo 1", record: '1234567890', priority: 1, idFlow: 1, status: 'inProgress' };

      reqMock.body = body
      reqMock.params = params

      resMock.json = jest.fn().mockResolvedValue({ error: 'Falha ao buscar processo.' });
      resMock.status = jest.fn(() => resMock);

      processService.getProcessById = jest.fn().mockRejectedValue({ error: 'Falha ao buscar processo.' });

      const result = await processService.updateProcess(reqMock, resMock);

      expect(result).toEqual({ error: 'Falha ao buscar processo.' });
      expect(processService.getProcessById).toHaveBeenCalled();
    });

    // it('Retornar false se o processo nao foi atualizado', async () => {
    //   reqMock.body = { nickname: "blue", idPriority: 0, status: 'notStarted', record: '1234567890', idFlow: 1 };
    //   reqMock.params = {idProcess: 1};
    //   ProcessModel.update.mockResolvedValue([0]);
    //   const result = await processService.updateProcess(reqMock, resMock);
    //   expect(result).toEqual({
    //     idFlow: 1,
    //     record: '1234567890',
    //     status: 'updated',
    //   });
    //   expect(ProcessModel.findOne).toHaveBeenCalled();
    // });
  });

  describe('executeUpdateQuery', () => {
    it('with update count returning bigger than 0', async () => {
      const updateCount = 1;
      const updatedEntities = [{ idProcess: 1, nickname: "processo 1", record: '1234567890', priority: 1, idFlow: 1 }]
      const expected = { idProcess: 1, nickname: "processo 1", record: '1234567890', priority: 1, idFlow: 1 }

      const process = { idProcess: 1, nickname: "processo x", record: '1234567890', priority: 1, idFlow: 1 }

      processService.process.update = jest.fn().mockResolvedValue([updateCount, updatedEntities]);
      processService.processAud.create = jest.fn().mockResolvedValue();

      const result = await processService.executeUpdateQuery(1, process, reqMock);

      expect(result).toEqual(expected);
      expect(processService.process.update).toHaveBeenCalled();
      expect(processService.processAud.create).toHaveBeenCalled();
    })

    it('with update count returning equals than 0', async () => {
      const updateCount = 0;
      const updatedEntities = []

      const process = { idProcess: 1, nickname: "processo x", record: '1234567890', priority: 1, idFlow: 1 }

      services.processService.process.update = jest.fn().mockResolvedValue([updateCount, updatedEntities]);
      services.processService.processAud.create = jest.fn().mockResolvedValue();

      const result = await services.processService.executeUpdateQuery(1, process, reqMock);

      expect(result).toBeFalsy();
      expect(services.processService.process.update).toHaveBeenCalled();
      expect(services.processService.processAud.create).toHaveBeenCalled();
    })
  })

  describe('updateProcessStage', () => {
    it('happy flow', () => {

    })
  })

  describe('deleteProcessByRecord', () => {
    it('Excluir um processo com o registro fornecido', async () => {
      const record = '1234567890';
      
      ProcessModel.destroy.mockResolvedValue(1);
      processService.processAud.create = jest
        .fn()
        .mockResolvedValue({ processAud: null }); // This can be useful in future
      
      const result = await processService.deleteProcessByRecord(
        record,
        reqMock,
      );

      expect(ProcessModel.destroy).toHaveBeenCalledWith({ where: { record } });
    });
  });

  // describe('getAllProcess', () => {
  //   it('Retornar uma lista de todos os processos', async () => {
  //     ProcessModel.findAll.mockResolvedValue([
  //       { record: '1234567890', idFlow: 1 },
  //       { record: '0987654321', idFlow: 2 },
  //     ]);

  //     const result = await processService.getAllProcess();

  //     expect(result).toEqual([
  //       { record: '1234567890', idFlow: 1 },
  //       { record: '0987654321', idFlow: 2 },
  //     ]);
  //     expect(ProcessModel.findAll).toHaveBeenCalled();
  //   });
  // });

  // describe('getPriorityProcess', () => {
  //   it('Retornar uma lista de processos com base nas prioridades fornecidas', async () => {
  //     ProcessModel.findAll.mockResolvedValue([
  //       { record: '1234567890', idFlow: 1, idPriority: 1 },
  //       { record: '0987654321', idFlow: 2, idPriority: 2 },
  //     ]);

  //     const result = await processService.getPriorityProcess();

  //     expect(result).toEqual([
  //       { record: '1234567890', idFlow: 1, idPriority: 1 },
  //       { record: '0987654321', idFlow: 2, idPriority: 2 },
  //     ]);
  //     expect(ProcessModel.findAll).toHaveBeenCalledWith({
  //       where: {
  //         idPriority: {
  //           [Op.ne]: null,
  //         },
  //       },
  //     });
  //   });
  // });

  // describe('getProcessByUniqueKeys', () => {
  //   it('Retornar um processo com base no registro e ID do fluxo fornecidos', async () => {
  //     const record = '1234567890';
  //     const idFlow = 1;
  //     const process = { record, idFlow, status: 'active' };
  //     ProcessModel.findOne.mockResolvedValue(process);

  //     const result = await processService.getProcessByUniqueKeys(
  //       record,
  //       idFlow,
  //     );

  //     expect(result).toEqual(process);
  //     expect(ProcessModel.findOne).toHaveBeenCalledWith({
  //       where: { record, idFlow },
  //     });
  //   });
  // });

  // describe('getProcessByRecord', () => {
  //   it('Retornar um processo com base no registro fornecido', async () => {
  //     const record = '1234567890';
  //     const process = { record, idFlow: 1, status: 'active' };
  //     ProcessModel.findOne.mockResolvedValue(process);

  //     const result = await processService.getProcessByRecord(record);

  //     expect(result).toEqual(process);
  //     expect(ProcessModel.findOne).toHaveBeenCalledWith({ where: { record } });
  //   });
  // });

  // describe('getProcessByIdFlow', () => {
  //   it('Retornar uma lista de processos com base no ID do fluxo fornecido', async () => {
  //     const idFlow = 1;
  //     ProcessModel.findAll.mockResolvedValue([
  //       { record: '1234567890', idFlow, status: 'active' },
  //       { record: '0987654321', idFlow, status: 'inactive' },
  //     ]);

  //     const result = await processService.getProcessByIdFlow(idFlow);

  //     expect(result).toEqual([
  //       { record: '1234567890', idFlow, status: 'active' },
  //       { record: '0987654321', idFlow, status: 'inactive' },
  //     ]);
  //     expect(ProcessModel.findAll).toHaveBeenCalledWith({ where: { idFlow } });
  //   });
  // });

  // describe('validateRecord', () => {
  //   it('Deve validar e filtrar um registro de processo', () => {
  //     const validRecord = '12345678901234567890';
  //     const invalidRecord = 'ABCD123456';

  //     const result1 = processService.validateRecord(validRecord);
  //     const result2 = processService.validateRecord(invalidRecord);

  //     const validResult = {
  //       filteredRecord: '12345678901234567890',
  //       valid: true,
  //     };
  //     const invalidResult = {
  //       filteredRecord: '',
  //       valid: false,
  //     };

  //     expect(result1.valid).toEqual(true);

  //     expect(result2.valid).toEqual(false);
  //   });
  // });
});
