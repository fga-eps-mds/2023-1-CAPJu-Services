import 'dotenv/config';
import axios from 'axios';
import { FlowController } from '../../src/controllers/flow.js';

//jest.mock('../services/_index.js');
jest.mock('axios');

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('FlowController', () => {
  let flowController;

  beforeEach(() => {
    flowController = new FlowController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('showByProcessRecord - flows found (200)', async () => {
    const mockFlowProcesses = [{ id: 1, name: 'Flow 1' }];

    flowController.processService.getProcessByRecord = jest
      .fn()
      .mockResolvedValue(mockFlowProcesses);

    reqMock.params = { record: '123' };

    await flowController.showByProcessRecord(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(mockFlowProcesses);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('showByProcessRecord - no flows found (200)', async () => {
    const mockFlowProcesses = [];

    flowController.processService.getProcessByRecord = jest
      .fn()
      .mockResolvedValue(mockFlowProcesses);

    reqMock.params = { record: '123' };

    await flowController.showByProcessRecord(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Não há fluxos com o processo',
    });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('showByProcessRecord - internal server error (500)', async () => {
    const error = new Error('Internal Server Error');
    flowController.processService.getProcessByRecord = jest
      .fn()
      .mockRejectedValue(error);

    reqMock.params = { record: '123' };

    await flowController.showByProcessRecord(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error,
      message: 'Erro ao buscar fluxos do processo',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  describe('delete', () => {
    test('returning 200 ', async () => {
      const returnValue = 1;

      flowController.flowStageService.deleteFlowStageByIdFlow = jest.fn();

      flowController.flowUserService.deleteFlowUserById = jest.fn();

      flowController.processService.deleteByIdFlow = jest.fn();

      flowController.flowService.deleteFlowById = jest
        .fn()
        .mockResolvedValue(returnValue);

      await flowController.delete(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(200);
      return;
    });

    test('returning 404 ', async () => {
      const returnValue = 0;

      flowController.flowStageService.deleteFlowStageByIdFlow = jest.fn();

      flowController.flowUserService.deleteFlowUserById = jest.fn();

      flowController.processService.deleteByIdFlow = jest.fn();

      flowController.flowService.deleteFlowById = jest
        .fn()
        .mockResolvedValue(returnValue);

      await flowController.delete(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(404);
      return;
    });

    test('returning 404 ', async () => {
      const error = new Error('Internal Server Error');
      flowController.flowStageService.deleteFlowStageByIdFlow = jest
        .fn()
        .mockRejectedValue(error);

      await flowController.delete(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(500);
      return;
    });
  });

  describe('getHistoricByFlowId', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('retornar o tempo medio de um fluxo', async () => {
      const flowId = 1;
      const query_results = [
        {
          IdFlow: 1,
          idProcess: 2,
          processRecord: '54466326220239210526',
          operation: 'UPDATE',
          changedAt: '2023-10-21 15:47:03.515+00',
          newValues:
            '{"status":"inProgress","idStage":1,"effectiveDate":"2023-10-21T15:47:03.438Z"}',
        },
        {
          IdFlow: 1,
          idProcess: 3,
          processRecord: '54466326220239210526',
          operation: 'UPDATE',
          changedAt: '2023-10-21 15:47:03.515+00',
          newValues:
            '{"status":"inProgress","idStage":1,"effectiveDate":"2023-10-21T15:47:03.438Z"}',
        },
        {
          IdFlow: 1,
          idProcess: 3,
          processRecord: '54466326220239210526',
          operation: 'UPDATE',
          changedAt: '2023-10-24 15:47:04.515+00',
          newValues:
            '{"status":"inProgress","idStage":2,"effectiveDate":"2023-10-24T15:47:03.438Z"}',
        },
        {
          IdFlow: 1,
          idProcess: 3,
          processRecord: '54466326220239210526',
          operation: 'UPDATE',
          changedAt: '2023-10-25 15:47:05.515+00',
          newValues:
            '{"status":"inProgress","idStage":1,"effectiveDate":"2023-10-24T15:47:03.438Z"}',
        },
        {
          IdFlow: 1,
          idProcess: 3,
          processRecord: '54466326220239210526',
          operation: 'UPDATE',
          changedAt: '2023-10-26 15:47:06.515+00',
          newValues:
            '{"status":"inProgress","idStage":2,"effectiveDate":"2023-10-24T15:47:03.438Z"}',
        },
        {
          IdFlow: 1,
          idProcess: 3,
          processRecord: '54466326220239210526',
          operation: 'UPDATE',
          changedAt: '2023-10-27 15:47:07.515+00',
          newValues:
            '{"finalised":"true","status":"inProgress","idStage":3,"effectiveDate":"2023-10-25T15:47:03.438Z"}',
        },
      ];

      const findAll_results = [
        {
          idFlowStage: 1,
          idStageA: 1,
          idStageB: 2,
          idFlow: 1,
          commentary: '',
          createdAt: '2023-10-18 23:40:24.348+00',
          updatedAt: '2023-10-18 23:40:24.348+00',
        },
        {
          idFlowStage: 2,
          idStageA: 2,
          idStageB: 3,
          idFlow: 1,
          commentary: '',
          createdAt: '2023-10-18 23:40:24.363+00',
          updatedAt: '2023-10-18 23:40:24.363+00',
        },
      ];

      const expected_result = [1, 2, 3, undefined];
      reqMock.params = { idFlow: 1 };

      flowController.flowService.getHistoricByFlowId = jest
        .fn()
        .mockResolvedValue(query_results);

      flowController.flowStageService.findAllByIdFlow = jest
        .fn()
        .mockResolvedValue(findAll_results);

      const result = await flowController.showHistoricByFlowId(
        reqMock,
        resMock,
      );
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    it('Não encontrar Histórico de um fluxo', async () => {
      const flowId = 1;
      const query_results = undefined;
      const error = new Error(
        "Cannot read properties of undefined (reading 'length')",
      );

      reqMock.params = { idFlow: 1 };

      flowController.flowService.getHistoricByFlowId = jest
        .fn()
        .mockResolvedValue(query_results);

      const result = await flowController.showHistoricByFlowId(
        reqMock,
        resMock,
      );
      expect(resMock.json).toHaveBeenCalledWith({
        error,
        message:
          'Erro ao buscar o histórico de alteraçõe dos processos de um fluxos',
      });

      expect(resMock.status).toHaveBeenCalledWith(500);
    });

    it('Fluxo sem nenhum Processo', async () => {
      const query_results = [];

      reqMock.params = { idFlow: 1 };

      flowController.flowService.getHistoricByFlowId = jest
        .fn()
        .mockResolvedValue(query_results);

      const result = await flowController.showHistoricByFlowId(
        reqMock,
        resMock,
      );
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Não há dados sobre o fluxos',
      });

      expect(resMock.status).toHaveBeenCalledWith(404);
    });

    it('Hisórico de um Fluxo que nenhum processo passou de uma etapa posterior', async () => {
      const query_results = [
        {
          IdFlow: 1,
          idProcess: 2,
          processRecord: '54466326220239210526',
          operation: 'UPDATE',
          changedAt: '2023-10-21 15:47:03.515+00',
          newValues:
            '{"status":"inProgress","idStage":1,"effectiveDate":"2023-10-21T15:47:03.438Z"}',
        },
      ];

      const findAll_results = [
        {
          idFlowStage: 1,
          idStageA: 1,
          idStageB: 2,
          idFlow: 1,
          commentary: '',
          createdAt: '2023-10-18 23:40:24.348+00',
          updatedAt: '2023-10-18 23:40:24.348+00',
        },
        {
          idFlowStage: 2,
          idStageA: 2,
          idStageB: 3,
          idFlow: 1,
          commentary: '',
          createdAt: '2023-10-18 23:40:24.363+00',
          updatedAt: '2023-10-18 23:40:24.363+00',
        },
        {
          idFlowStage: 3,
          idStageA: 3,
          idStageB: 4,
          idFlow: 1,
          commentary: '',
          createdAt: '2023-10-18 23:40:24.363+00',
          updatedAt: '2023-10-18 23:40:24.363+00',
        },
      ];
      reqMock.params = { idFlow: 1 };

      flowController.flowService.getHistoricByFlowId = jest
        .fn()
        .mockResolvedValue(query_results);

      flowController.flowStageService.findAllByIdFlow = jest
        .fn()
        .mockResolvedValue(findAll_results);

      await flowController.showHistoricByFlowId(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
    });
  });

});
