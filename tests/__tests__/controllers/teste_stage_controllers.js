import 'dotenv/config';
import { StageController } from '../../../src/controllers/stage.js';
import axios from 'axios';

import * as utils from '../../../middleware/authMiddleware.js';

jest.mock('axios');

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const FlowStageControllers = {
  index: jest.fn(),
  showStageByStageId: jest.fn(),
  store: jest.fn(),
  delete: jest.fn(),
};

describe('StageController', () => {
  let stageController;

  beforeEach(() => {
    stageController = new StageController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // checa se o findAll preenchdio e se retorna o status 200
  test('index - list all stages (200)', async () => {
    const stages = [
      {
        idStage: 1,
        idUnit: 1,
        name: 'Etapa 1',
        duration: 1,
      },
      {
        idStage: 2,
        idUnit: 1,
        name: 'Etapa 2',
        duration: 2,
      },
    ];
    reqMock.filter = {
      value: 'blue',
    };
    reqMock.query = {
      offset: 5,
      limit: 5,
    };

    jest.spyOn(utils, 'userFromReq').mockResolvedValue({ unit: { idUnit: 1 } });

    stageController.stageService.findByUnit = jest
      .fn()
      .mockResolvedValue(stages);

    stageController.stageService.countStage = jest.fn().mockResolvedValue(2);

    await stageController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({ stages, totalPages: 1 });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  // checa se o findAll devolve um array vazio e se retorna o status 204
  test('index - list all stages (204)', async () => {
    reqMock.filter = {
      value: 'blue',
    };
    reqMock.query = {
      offset: 5,
      limit: 5,
    };

    jest.spyOn(utils, 'getUserRoleAndUnitFilterFromReq');
    utils.getUserRoleAndUnitFilterFromReq.mockImplementation(() => {
      return {
        idUnit: 1,
        idRole: 1,
      };
    });

    stageController.stageService.findByUnit = jest.fn().mockResolvedValue([]);

    stageController.stageService.countStage = jest.fn().mockResolvedValue(0);

    await stageController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({ stages: [], totalPages: 0 });
    expect(resMock.status).toHaveBeenCalledWith(204);
  });

  //simula um erro interno do servidor, caso haja retornará a mensagem e status 500
  test('index - internal server error (500)', async () => {
    const error = new Error('Internal Server Error');
    stageController.stageService.findByUnit = jest
      .fn()
      .mockRejectedValue(error);

    await stageController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Erro ao buscar etapas',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  //checa se ao chamar o a etapa pelo ID retornará a a etapa correspondente e o status 200
  test('showStageByStageId - stage found (200)', async () => {
    const stageId = 1;
    const stageData = { id: stageId, name: 'Stage 1' };

    stageController.stageService.findOneByStageId = jest
      .fn()
      .mockResolvedValue(stageData);

    reqMock.params = { idStage: stageId };

    await stageController.showStageByStageId(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(stageData);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  //caso a etapa buscada pelo ID não seja encontrada, retornará a mensagem e o status 401
  test('showStageByStageId - stage not found (401)', async () => {
    const stageId = 1;

    stageController.stageService.findOneByStageId = jest
      .fn()
      .mockResolvedValue(false);

    reqMock.params = { idStage: stageId };

    await stageController.showStageByStageId(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error: 'Essa etapa não existe',
    });
    expect(resMock.status).toHaveBeenCalledWith(401);
  });

  //caso ocorra um erro interno do servidor ele retornará a mensagem de erro e o status 500
  test('showStageByStageId - internal server error (500)', async () => {
    const error = new Error('Internal Server Error');
    stageController.stageService.findOneByStageId = jest
      .fn()
      .mockRejectedValue(error);

    reqMock.params = { idStage: 1 };

    await stageController.showStageByStageId(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Erro ao buscar etapas',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  //verifica se a etapa pode ser criada com id 1  e duração de 5 dias a fim de
  // checar se é criada a etapa corretamente devovlendo o status 200
  test('store - create stage (200)', async () => {
    const stageData = {
      name: 'New Stage',
      idUnit: 1,
      duration: 5,
    };

    jest.spyOn(utils, 'userFromReq');
    utils.userFromReq.mockImplementation(() => {
      return { unit: { idUnit: 1 } };
    }); // This can be useful someday
    stageController.stageService.createStage = jest
      .fn()
      .mockResolvedValue(stageData);

    reqMock.body = stageData;
    await stageController.store(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(stageData);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  // Checa erro 500 da função store
  test('store - create stage (error)', async () => {
    const error = new Error('Internal Server Error');
    const stageData = {
      name: 'New Stage',
      idUnit: 1,
      duration: 5,
    };

    stageController.stageService.createStage = jest
      .fn()
      .mockRejectedValue(error);

    reqMock.body = stageData;
    await stageController.store(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(error);
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test('update - update stage (200)', async () => {
    reqMock.body = {
      name: 'New Stage',
      duration: 5,
    };

    const stageData = {
      name: 'New Stage',
      idUnit: 1,
      duration: 5,
    };

    stageController.stageService.updateStage = jest
      .fn()
      .mockResolvedValue(stageData);

    await stageController.update(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Etapa atualizada com sucesso',
    });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('update - update stage (404)', async () => {
    reqMock.body = {
      name: 'New Stage',
      duration: 5,
    };

    const stageData = {
      name: 'New Stage',
      idUnit: 1,
      duration: 5,
    };

    stageController.stageService.updateStage = jest
      .fn()
      .mockResolvedValue(null);

    await stageController.update(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Essa etapa não existe!',
    });
    expect(resMock.status).toHaveBeenCalledWith(404);
  });

  test('update - update stage (500)', async () => {
    const error = new Error('Internal Server Error');

    reqMock.body = {
      name: 'New Stage',
      duration: 5,
    };

    stageController.stageService.updateStage = jest
      .fn()
      .mockRejectedValue(error);

    await stageController.update(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error,
      message: 'Erro ao atualizar etapa',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  //checa se é possível deletar a etapa através do seu id e nome
  //caso der certo, retorna status 200
  test('delete - delete stage (200)', async () => {
    const stageId = 1;
    const stageData = { id: stageId, name: 'Stage 1' };

    stageController.stageService.deleteStage = jest
      .fn()
      .mockResolvedValue(stageData);

    reqMock.params = { idStage: stageId };

    await stageController.delete(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(stageData);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  //checa se a etapa não for deletada retorna que a etapa não foi encontrada
  // e o status 401
  test('delete - stage not found (401)', async () => {
    const stageId = 1;

    stageController.stageService.deleteStage = jest
      .fn()
      .mockResolvedValue(false);

    reqMock.params = { idStage: stageId };

    await stageController.delete(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      error: 'Etapa não encontrada',
    });
    expect(resMock.status).toHaveBeenCalledWith(401);
  });

  //checa se a etapa não for deletada por um erro interno do servidor
  // retornando o status 500 e a mensagem de erro
  test('delete - internal server error (500)', async () => {
    const error = new Error('Internal Server Error');
    stageController.stageService.deleteStage = jest
      .fn()
      .mockRejectedValue(error);

    reqMock.params = { idStage: 1 };

    await stageController.delete(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Erro ao deletar etapa',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });
});
