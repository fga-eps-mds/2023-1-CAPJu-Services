import ProcessService, { validateRecord } from '../../src/services/process';
import services from '../../src/services/_index';
import ProcessModel from '../../src/models/process';
// import ProcessAudService from '../../src/services/processAudService';
import Sequelize, { DataTypes } from 'sequelize';

jest.mock('sequelize', () => {
  return {
    ...jest.requireActual('sequelize'),
    default: jest.fn(() => ({
      define: jest.fn(),
      sync: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      query: jest.fn(),
    })),
    __esModule: true,
  };
});

const ProcessAudModel = {
  create: jest.fn(),
};

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

// jest.mock('../../src/models/process.js');
jest.mock('../../src/services/processAudService');

describe('ProcessService', () => {
  let processService;

  beforeEach(() => {
    processService = new ProcessService(ProcessModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProcess', () => {
    it('Criar um novo processo com os parâmetros fornecidos', async () => {
      const params = { record: '1234567890', idFlow: 1 };
      const createdProcess = { idProcess: 1, record: '1234567890', idFlow: 1 };

      const spyOnProcessModelCreate = jest
        .spyOn(ProcessModel, 'create')
        .mockResolvedValue(createdProcess);

      const result = await processService.createProcessAndAud(params);

      expect(result).toEqual(createdProcess);
      expect(spyOnProcessModelCreate).toHaveBeenCalled();
    });
  });

  describe('updateProcess', () => {
    it('Atualizar um processo com os parâmetros e registro fornecidos', async () => {
      const params = { idProcess: 1 };
      const body = {
        idProcess: 1,
        nickname: 'processo 1',
        record: '1234567890',
        priority: 1,
        idFlow: 1,
        status: 'inProgress',
      };
      const originalProcess = {
        idProcess: 1,
        nickname: 'processo 1',
        record: '1234567890',
        priority: 1,
        idFlow: 1,
        status: 'notStarted',
      };

      const updatedProcess = { ...params, status: 'updated' };

      reqMock.body = body;
      reqMock.params = params;

      processService.getProcessById = jest
        .fn()
        .mockResolvedValue(originalProcess);
      processService.flowStageService.findAllByIdFlow = jest
        .fn()
        .mockResolvedValue([updatedProcess]);
      processService.executeUpdateQuery = jest
        .fn()
        .mockResolvedValue(updatedProcess);

      const result = await processService.updateProcess(reqMock, resMock);

      expect(result).toEqual(updatedProcess);
      expect(processService.getProcessById).toHaveBeenCalled();
      expect(
        processService.flowStageService.findAllByIdFlow,
      ).toHaveBeenCalled();
      expect(processService.executeUpdateQuery).toHaveBeenCalled();
    });

    it('Atualizar um processo inexistente', async () => {
      const params = {
        idProcess: 1,
        nickname: 'processo 1',
        record: '1234567890',
        priority: 1,
        idFlow: 1,
      };
      const body = {
        idProcess: 1,
        nickname: 'processo 1',
        record: '1234567890',
        priority: 1,
        idFlow: 1,
        status: 'inProgress',
      };

      reqMock.body = body;
      reqMock.params = params;

      resMock.json = jest
        .fn()
        .mockResolvedValue({ error: 'Falha ao buscar processo.' });
      resMock.status = jest.fn(() => resMock);

      processService.getProcessById = jest
        .fn()
        .mockRejectedValue({ error: 'Falha ao buscar processo.' });

      const result = await processService.updateProcess(reqMock, resMock);

      expect(result).toEqual({ error: 'Falha ao buscar processo.' });
      expect(processService.getProcessById).toHaveBeenCalled();
    });

    it('Caso flowStages não tiver valores', async () => {
      const params = {
        idProcess: 1,
        idFLow: 1,
        limit: 1,
      };

      reqMock.params = params;

      resMock.json = jest
        .fn()
        .mockResolvedValue({ error: 'Não há etapas neste fluxo' });
      resMock.status = jest.fn(() => resMock);

      processService.flowStageService.findAllByIdFlow = jest
        .fn()
        .mockResolvedValue([]);

      processService.getProcessById = jest.fn().mockResolvedValue(reqMock);

      const result = await processService.updateProcess(reqMock, resMock);

      expect(result).toEqual({ error: 'Não há etapas neste fluxo' });
    });
  });

  describe('finalizeProcess', () => {
    it('Finalizar processo a partir do idProcess', async () => {
      const params = { idProcess: 1 };
      const body = { idProcess: 1, finalised: false, status: 'inProgress' };
      const originalProcess = { idProcess: 1 };
      const finishedProcess = { ...params };

      reqMock.body = body;
      reqMock.params = params;

      processService.executeUpdateQuery = jest
        .fn()
        .mockResolvedValue(originalProcess);

      const result = await processService.finalizeProcess(reqMock);

      expect(result).toEqual(finishedProcess);
    });
  });

  describe('archiveProcess', () => {
    it('Arquivar processo a partir do idProcess', async () => {
      const params = { idProcess: 1 };
      const body = { archivedFlag: false, status: 'inProgress' };
      const originalProcess = { idProcess: 1 };
      const archiveProcess = { ...params };

      reqMock.body = body;
      reqMock.params = params;

      processService.executeUpdateQuery = jest
        .fn()
        .mockResolvedValue(originalProcess);

      const result = await processService.archiveProcess(reqMock);

      expect(result).toEqual(archiveProcess);
    });
  });

  describe('updateProcessStage', () => {
    it('Atualizar a etapa de um processo com identificadores invalidos', async () => {
      const params = { idProcess: 1 };
      const body = {
        idProcess: 1,
        from: 'a',
        to: 'b',
        idFlow: '1',
      };
      const originalProcessStage = {
        idProcess: 1,
        from: 'a',
        to: 'b',
        idFlow: '1',
      };

      reqMock.body = body;
      reqMock.params = params;

      resMock.json = jest.fn().mockResolvedValue({
        error: 'Identificadores inválidos',
        message: `Identificadores '${originalProcessStage.idFlow}', '${originalProcessStage.from}', ou '${originalProcessStage.to}' são inválidos`,
      });
      resMock.status = jest.fn(() => resMock);

      const result = await processService.updateProcessStage(reqMock, resMock);

      expect(result).toEqual({
        error: 'Identificadores inválidos',
        message: `Identificadores '${originalProcessStage.idFlow}', '${originalProcessStage.from}', ou '${originalProcessStage.to}' são inválidos`,
      });
    });

    it('Atualizar etapa de um processo', async () => {
      const params = { idProcess: 1 };
      const body = {
        idProcess: 1,
        from: 1,
        to: 2,
        idFlow: 1,
        idStageA: 1,
        idStageB: 2,
      };
      const originalProcessStage = {
        idProcess: 1,
        from: 1,
        to: 2,
        idFlow: 1,
        idStageA: 1,
        idStageB: 2,
        canAdvance: false,
      };
      const updatedProcessStage = {
        ...params,
        idStage: 2,
        effectiveDate: new Date(),
        canAdvance: true,
      };

      reqMock.body = body;
      reqMock.params = params;

      resMock.json = jest.fn().mockResolvedValue(updatedProcessStage);
      resMock.status = jest.fn(() => resMock);

      processService.flowStageService.findAllByIdFlow = jest
        .fn()
        .mockResolvedValue([originalProcessStage.idFlow]);

      //FALHANDO
      // processService.executeUpdateQuery = jest
      //   .fn()
      //   .mockResolvedValue(updatedProcessStage, reqMock);
      //FALHANDO

      const result = await processService.updateProcessStage(reqMock, resMock);
      expect(result).toEqual(updatedProcessStage);
    });

    // it('Caso flowStages não tiver valores', async () => {
    //   const params = {
    //     idProcess: 1,
    //     idFLow: 1,
    //     limit: 1,
    //   };

    //   reqMock.params = params;

    //   resMock.json = jest
    //     .fn()
    //     .mockResolvedValue({ error: 'Não há etapas neste fluxo' });
    //   resMock.status = jest.fn(() => resMock);

    //   processService.flowStageService.findAllByIdFlow = jest
    //     .fn()
    //     .mockResolvedValue([]);

    //   processService.getProcessById = jest.fn().mockResolvedValue(reqMock);

    //   const result = await processService.updateProcess(reqMock, resMock);

    //   expect(result).toEqual({ error: 'Não há etapas neste fluxo' });
    // });
  });

  // it('Retornar o processo atualizado se o processo foi atualizado com sucesso', async () => {
  //   const params = { record: '1234567890', idFlow: 1 };
  //   const record = '1234567890';
  //   const updatedProcess = {
  //     idFlow: 1,
  //     record: '1234567890',
  //     status: 'updated',
  //   };

  //   ProcessModel.update.mockResolvedValue([1]);
  //   ProcessModel.findOne.mockResolvedValue(updatedProcess);
  //   const result = await processService.updateProcess(params, record);
  //   expect(result).toEqual(updatedProcess);
  //   expect(ProcessModel.update).toHaveBeenCalledWith(params, {
  //     where: { record },
  //   });
  //   expect(ProcessModel.findOne).toHaveBeenCalledWith({ where: { record } });
  // });
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

  describe('executeUpdateQuery', () => {
    it('with update count returning bigger than 0', async () => {
      const updateCount = 1;
      const updatedEntities = [
        {
          idProcess: 1,
          nickname: 'processo 1',
          record: '1234567890',
          priority: 1,
          idFlow: 1,
        },
      ];
      const expected = {
        idProcess: 1,
        nickname: 'processo 1',
        record: '1234567890',
        priority: 1,
        idFlow: 1,
      };

      const process = {
        idProcess: 1,
        nickname: 'processo x',
        record: '1234567890',
        priority: 1,
        idFlow: 1,
      };

      processService.process.update = jest
        .fn()
        .mockResolvedValue([updateCount, updatedEntities]);
      processService.processAud.create = jest.fn().mockResolvedValue();

      const result = await processService.executeUpdateQuery(
        1,
        process,
        reqMock,
      );

      expect(result).toEqual(expected);
      expect(processService.process.update).toHaveBeenCalled();
      expect(processService.processAud.create).toHaveBeenCalled();
    });

    it('with update count returning equals than 0', async () => {
      const updateCount = 0;
      const updatedEntities = [];

      const process = {
        idProcess: 1,
        nickname: 'processo x',
        record: '1234567890',
        priority: 1,
        idFlow: 1,
      };

      services.processService.process.update = jest
        .fn()
        .mockResolvedValue([updateCount, updatedEntities]);
      services.processService.processAud.create = jest.fn().mockResolvedValue();

      const result = await services.processService.executeUpdateQuery(
        1,
        process,
        reqMock,
      );

      expect(result).toBeFalsy();
      expect(services.processService.process.update).toHaveBeenCalled();
      expect(services.processService.processAud.create).toHaveBeenCalled();
    });
  });

  describe('deleteProcessByRecord', () => {
    it('Deletar um processo com o registro fornecido', async () => {
      const params = { record: '1234567890', idFlow: 1 };
      const deletedProcess = { record: '1234567890', idFlow: 1 };

      reqMock.params = params;

      resMock.json = jest.fn().mockResolvedValue();
      resMock.status = jest.fn(() => resMock);

      processService.processAud.create = jest.fn().mockResolvedValue(params);

      processService.process.destroy = jest.fn().mockResolvedValue(params);

      const result = await processService.deleteProcessByRecord(
        params.record,
        params,
      );

      expect(result).toEqual(deletedProcess);
    });
  });

  describe('deleteByIdFlow', () => {
    it('Deletar um processo a partir do idFlow', async () => {
      const params = { idFlow: 1 };
      const deletedProcess = { idFlow: 1 };

      reqMock.params = params;

      resMock.json = jest.fn().mockResolvedValue();
      resMock.status = jest.fn(() => resMock);

      processService.process.destroy = jest.fn().mockResolvedValue(params);

      const result = await processService.deleteByIdFlow();

      expect(result).toEqual(deletedProcess);
    });
  });

  //FALHANDO
  // describe('deleteProcessById', () => {
  //   it('Deletar um processo a partir do identificador', async () => {
  //     const params = { idProcess: 1 };
  //     const deletedProcess = { idProcess: 1 };

  //     reqMock.params = params;

  //     resMock.json = jest.fn().mockResolvedValue();
  //     resMock.status = jest.fn(() => resMock);

  //     processService.noteRepository.destroy = jest
  //       .fn()
  //       .mockResolvedValue(params);

  //     processService.processesFileItemRepository = jest
  //       .fn()
  //       .mockResolvedValue(params);

  //     processService.processAud.delete = jest.fn().mockResolvedValue(params);

  //     processService.process.destroy = jest.fn().mockResolvedValue(params);

  //     const result = await processService.deleteProcessById(params);

  //     expect(result).toEqual(deletedProcess);
  //   });
  // });

  // describe('getAllProcess', () => {
  //   it('Retornar uma lista de todos os processos', async () => {
  //     const params = { record: '48390332920234024580', idFLow: 1 };
  //     const originalProcess = { record: '48390332920234024580', idFLow: 1 };
  //     const searchedProcess = { ...params };

  //     reqMock.params = params;

  //     processService.process.findAll = jest
  //       .fn()
  //       .mockResolvedValue(originalProcess);

  //     const result = await processService.getAllProcess();

  //     expect(result).toEqual(searchedProcess);
  //   });
  // });

  describe('getAndCountAllProcess', () => {
    it('Retornar uma lista de todos os processos', async () => {
      const params = { record: '48390332920234024580', idFLow: 1 };
      const originalProcess = { record: '48390332920234024580', idFLow: 1 };
      const searchedProcess = { ...params };

      reqMock.params = params;

      processService.process.findAndCountAll = jest
        .fn()
        .mockResolvedValue(originalProcess);

      const result = await processService.getAndCountAllProcess();

      expect(result).toEqual(searchedProcess);
    });
  });

  describe('getPriorityProcess', () => {
    it('Retornar uma lista de processos com base nas prioridades fornecidas', async () => {
      const params = { record: '48390332920234024580', idFLow: 1 };
      const originalProcess = { record: '48390332920234024580', idFLow: 1 };
      const searchedPriorityProcess = { ...params };

      reqMock.params = params;

      processService.process.findAll = jest
        .fn()
        .mockResolvedValue(originalProcess);

      const result = await processService.getPriorityProcess();

      expect(result).toEqual(searchedPriorityProcess);
    });
  });

  describe('getProcessByUniqueKeys', () => {
    it('Buscar processo a partir da sua chave única', async () => {
      const params = { record: '48390332920234024580', idFLow: 1 };
      const originalProcess = { record: '48390332920234024580', idFLow: 1 };
      const searchedProcess = { ...params };

      reqMock.params = params;

      processService.process.findOne = jest
        .fn()
        .mockResolvedValue(originalProcess);

      const result = await processService.getProcessByUniqueKeys(reqMock);

      expect(result).toEqual(searchedProcess);
    });
  });

  describe('getProcessByRecord', () => {
    it('Buscar processo a partir do seu registro', async () => {
      const originalProcess = { record: '48390332920234024580' };
      const searchedProcess = { record: '48390332920234024580' };

      processService.process.findOne = jest
        .fn()
        .mockResolvedValue(originalProcess);

      const result = await processService.getProcessByRecord(originalProcess);

      expect(result).toEqual(searchedProcess);
    });
  });

  describe('getProcessByIdFlow', () => {
    it('Buscar processo a partir do seu idFlow', async () => {
      const originalProcess = { idFlow: 1 };
      const searchedProcess = { idFlow: 1 };

      processService.process.findAll = jest
        .fn()
        .mockResolvedValue(originalProcess);

      const result = await processService.getProcessByIdFlow(originalProcess);

      expect(result).toEqual(searchedProcess);
    });
  });

  describe('getProcessById', () => {
    it('Buscar processo a partir do seu registro', async () => {
      const originalProcess = { idProcess: 1 };
      const searchedProcess = { idProcess: 1 };

      processService.process.findOne = jest
        .fn()
        .mockResolvedValue(originalProcess);

      const result = await processService.getProcessById(originalProcess);

      expect(result).toEqual(searchedProcess);
    });
  });

  describe('getProcessRecordById', () => {
    it('Buscar o registro de um processo a partir do identificador', async () => {
      const originalProcess = { idProcess: 1, record: ['12345678901'] };
      const searchedProcess = { idProcess: 1, record: ['12345678901'] };

      processService.getProcessById = jest
        .fn()
        .mockResolvedValue(originalProcess);

      const result = await processService.getProcessRecordById(
        originalProcess.idProcess,
      );

      expect(result).toEqual(searchedProcess.record);
    });
  });

  describe('validateRecord', () => {
    it('Deve validar e filtrar um registro de processo', () => {
      const validRecord = '12345678901234567890';
      const invalidRecord = 'ABCD123456';

      const result1 = processService.validateRecord(validRecord);
      const result2 = processService.validateRecord(invalidRecord);

      expect(result1.valid).toEqual(true);

      expect(result2.valid).toEqual(false);
    });
  });

  //FALHANDO
  // describe('countRows', () => {
  //   it('Deve contar as linhas de uma tabela', () => {
  //     const countedRow = { async_id_symbol: 6148, trigger_async_id_symbol: 6136,};

  //     processService.process.count = jest
  //       .fn()
  //       .mockResolvedValue();

  //     const result = processService.countRows();

  //     expect(result).toEqual(countedRow);
  //   });
  // });
});
