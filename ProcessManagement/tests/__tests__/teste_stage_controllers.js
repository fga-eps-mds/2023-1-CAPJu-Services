import 'dotenv/config';
import { StageController } from '../../src/controllers/stage.js';
import controllers from "../../src/controllers/_index.js";
import services from "../../src/services/_index.js";
import axios from 'axios';

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

  //checa se o findAll devolve um array vazio e se retorna o status 200
  // test('index - list all stages (200)', async () => {
  //   stageController.stageService.findAll = jest
  //     .fn()
  //     .mockResolvedValue([]);

  //   await stageController.index(reqMock, resMock);

  //   expect(resMock.json).toHaveBeenCalledWith([]);
  //   expect(resMock.status).toHaveBeenCalledWith(200);
  // });

  //caso não haja nenhuma etapa, retornará o status 401 e a mensagem de não ter etapas cadastardas
  test('index - no stages found (401)', async () => {
    stageController.stageService.findAll = jest
      .fn()
      .mockResolvedValue(false);

    await stageController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Erro ao buscar etapas',
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  //simula um erro interno do servidor, caso haja retornará a mensagem e status 500
  test('index - internal server error (500)', async () => {
    const error = new Error('Internal Server Error');
    stageController.stageService.findAll = jest
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

    stageController.stageService.createStage = jest
      .fn()
      .mockResolvedValue(stageData);

    reqMock.body = stageData;

    await stageController.store(reqMock, resMock);
    
    expect(resMock.json).toHaveBeenCalledWith(stageData);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("update - set new name (200)", async () => {
    services.stageService.updateStage = jest.fn().mockResolvedValue(true);

    reqMock.body = {
      idStage: 1,
      name: "Etapa",
    };
    await controllers.stageController.update(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({ message: 'Etapa atualizada com sucesso' });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test("update - failed to update stage (404)", async () => {
    services.stageService.updateStage = jest.fn().mockResolvedValue(false);

    reqMock.body = {
      idStage: 1,
      name: "Etapa",
    };
    await controllers.stageController.update(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
      message: "Essa etapa não existe!",
    });
    expect(resMock.status).toHaveBeenCalledWith(404);
  });

  test("update - failed to update stage (500)", async () => {
    const error = new Error("Internal Error");
    services.stageService.updateStage = jest.fn().mockRejectedValue(error);

    await controllers.stageController.update(reqMock, resMock);

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

