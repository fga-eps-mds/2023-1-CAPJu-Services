import { DocumentAudController } from '../../src/controllers/documentAud.js';
import * as utils from '../../middleware/authMiddleware.js';

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('DocumentAudController', () => {
  let documentAudController;

  beforeEach(() => {
    documentAudController = new DocumentAudController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('registerEvent - (200)', async () => {

    jest.spyOn(utils, 'userFromReq');
    utils.userFromReq.mockImplementation(() => {
        return { cpf: '12345678901' }
    });
    reqMock.body = {
        emitedAt:'11/28/2023',
        emitedBy:'12345678901',
        uuid: '2992b395-5845-4f26-9e8d-8c70d818b365',
        type: 'PROCESS_EVENTS_XLSX'
    }

    documentAudController.documentAudRepository.create = jest
        .fn()
        .mockResolvedValue({});


    await documentAudController.registerEvent(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({});
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('registerEvent - (200)', async () => {

    jest.spyOn(utils, 'userFromReq');
    utils.userFromReq.mockImplementation(() => {
        return { cpf: '12345678902' }
    });
    reqMock.body = {
        emitedAt:'11/28/2023',
        emitedBy:'12345678901',
        uuid: '2992b395-5845-4f26-9e8d-8c70d818b365',
        type: 'PROCESS_EVENTS_XLSX'
    }

    documentAudController.documentAudRepository.create = jest
        .fn()
        .mockResolvedValue({});


    await documentAudController.registerEvent(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
        error: 'Erro ao registrar evento',
        message: `Usuário da requisição diverge do usuário do evento`,
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });

  test('registerEvent - (200)', async () => {

    jest.spyOn(utils, 'userFromReq');
    utils.userFromReq.mockImplementation(() => {
        return { cpf: '12345678901' }
    });
    reqMock.body = {
        emitedAt:'11/28/2023',
        emitedBy:'12345678901',
        uuid: '2992b395-5845-4f26-9e8d-8c70d818b365',
        type: 'PROCESS_EVENTS_XLSX'
    }

    documentAudController.documentAudRepository.create = jest
        .fn()
        .mockRejectedValue('Não foi possível criar o usuário');


    await documentAudController.registerEvent(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith({
        error: 'Não foi possível criar o usuário',
        message: `Erro ao registrar evento`,
    });
    expect(resMock.status).toHaveBeenCalledWith(500);
  });



});
