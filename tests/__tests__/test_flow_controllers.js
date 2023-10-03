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

 

});
