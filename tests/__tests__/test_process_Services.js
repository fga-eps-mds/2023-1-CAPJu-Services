import ProcessService, { validateRecord } from '../../src/services/process';
import ProcessAudService from '../../src/services/processAudService';
import { Op } from 'sequelize';

const ProcessAudModel = {
  create: jest.fn(),
}

const ProcessModel = {
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  processAud: {
    create: jest.fn()
  }
};


const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('ProcessService', () => {
  let processService;

  beforeEach(() => {
    processService = new ProcessService(ProcessModel);

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // describe('createProcess', () => {
  //   it('Criar um novo processo com os parâmetros fornecidos', async () => {
  //     const params = { record: '1234567890', idFlow: 1 };
  //     ProcessModel.create.mockResolvedValue(params);
  //     ProcessModel.processAud.mockResolvedValue([]);

  //     const result = await processService.createProcessAndAud(params);

  //     expect(result).toEqual(params);
  //     expect(ProcessModel.create).toHaveBeenCalledWith(params);
  //   });
  // });

  describe('updateProcess', () => {
    // it('Atualizar um processo com os parâmetros e registro fornecidos', async () => {
    //   const params = { record: '1234567890', idFlow: 1 };
    //   const record = '1234567890';
    //   const updatedProcess = { ...params, status: 'updated' };
    //   ProcessModel.update.mockResolvedValue([1]);
    //   ProcessModel.findOne.mockResolvedValue(updatedProcess);

    //   const result = await processService.updateProcess(params, record);

    //   expect(result).toEqual(updatedProcess);
    //   expect(ProcessModel.update).toHaveBeenCalledWith(params, {
    //     where: { record },
    //   });
    //   expect(ProcessModel.findOne).toHaveBeenCalledWith({ where: { record } });
    // });

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
  });

  describe('deleteProcessByRecord', () => {
    it('Excluir um processo com o registro fornecido', async () => {
      const record = '1234567890';
      ProcessModel.destroy.mockResolvedValue(1);
      console.log(ProcessModel.processAud)
      processService.processAud.create = jest
      .fn()
      .mockResolvedValue({processAud:null}); // This can be useful in future
      const result = await processService.deleteProcessByRecord(record, reqMock);

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

  describe('getPriorityProcess', () => {
    it('Retornar uma lista de processos com base nas prioridades fornecidas', async () => {
      ProcessModel.findAll.mockResolvedValue([
        { record: '1234567890', idFlow: 1, idPriority: 1 },
        { record: '0987654321', idFlow: 2, idPriority: 2 },
      ]);

      const result = await processService.getPriorityProcess();

      expect(result).toEqual([
        { record: '1234567890', idFlow: 1, idPriority: 1 },
        { record: '0987654321', idFlow: 2, idPriority: 2 },
      ]);
      expect(ProcessModel.findAll).toHaveBeenCalledWith({
        where: {
          idPriority: {
            [Op.ne]: null,
          },
        },
      });
    });
  });

  describe('getProcessByUniqueKeys', () => {
    it('Retornar um processo com base no registro e ID do fluxo fornecidos', async () => {
      const record = '1234567890';
      const idFlow = 1;
      const process = { record, idFlow, status: 'active' };
      ProcessModel.findOne.mockResolvedValue(process);

      const result = await processService.getProcessByUniqueKeys(
        record,
        idFlow,
      );

      expect(result).toEqual(process);
      expect(ProcessModel.findOne).toHaveBeenCalledWith({
        where: { record, idFlow },
      });
    });
  });

  describe('getProcessByRecord', () => {
    it('Retornar um processo com base no registro fornecido', async () => {
      const record = '1234567890';
      const process = { record, idFlow: 1, status: 'active' };
      ProcessModel.findOne.mockResolvedValue(process);

      const result = await processService.getProcessByRecord(record);

      expect(result).toEqual(process);
      expect(ProcessModel.findOne).toHaveBeenCalledWith({ where: { record } });
    });
  });

  describe('getProcessByIdFlow', () => {
    it('Retornar uma lista de processos com base no ID do fluxo fornecido', async () => {
      const idFlow = 1;
      ProcessModel.findAll.mockResolvedValue([
        { record: '1234567890', idFlow, status: 'active' },
        { record: '0987654321', idFlow, status: 'inactive' },
      ]);

      const result = await processService.getProcessByIdFlow(idFlow);

      expect(result).toEqual([
        { record: '1234567890', idFlow, status: 'active' },
        { record: '0987654321', idFlow, status: 'inactive' },
      ]);
      expect(ProcessModel.findAll).toHaveBeenCalledWith({ where: { idFlow } });
    });
  });

  describe('validateRecord', () => {
    it('Deve validar e filtrar um registro de processo', () => {
      const validRecord = '12345678901234567890';
      const invalidRecord = 'ABCD123456';

      const result1 = processService.validateRecord(validRecord);
      const result2 = processService.validateRecord(invalidRecord);

      const validResult = {
        filteredRecord: '12345678901234567890',
        valid: true,
      };
      const invalidResult = {
        filteredRecord: '',
        valid: false,
      };

      expect(result1.valid).toEqual(true);

      expect(result2.valid).toEqual(false);
    });
  });
});
