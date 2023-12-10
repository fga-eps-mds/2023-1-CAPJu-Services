import 'dotenv/config';
import axios from 'axios';
import { FlowController } from '../../../src/controllers/flow.js';
import * as utils from '../../../middleware/authMiddleware.js';

//jest.mock('../services/_index.js');
jest.mock('axios');

const reqMock = {};
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const mockQueryResults = [
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

describe('FlowController', () => {
  let flowController;

  beforeEach(() => {
    flowController = new FlowController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('index - flows found (200)', async () => {
    const mockFlowProcesses = [{ id: 1, idFlow: 1, name: 'Flow 1' }];

    const stages = [
      {
        idFlow: 1,
        idStageA: 1,
        idStageB: 2,
        commentary: 'commentary',
      },
    ];

    const sequences = {
      stages: [1, 2],
      sequences: [1, 2],
    };

    const MockResponse = {
      flows: [
        {
          idFlow: 1,
          idUnit: undefined,
          name: 'Flow 1',
          sequences: [1, 2],
          stages: [1, 2],
        },
      ],
      totalPages: 1,
    };

    flowController.flowService.findAll = jest
      .fn()
      .mockResolvedValue(mockFlowProcesses);

    flowController.flowService.countRows = jest.fn().mockResolvedValue(1);

    flowController.flowStageService.findAllByIdFlow = jest
      .fn()
      .mockResolvedValue(stages);

    flowController.flowService.stagesSequencesFromFlowStages = jest
      .fn()
      .mockResolvedValue(sequences);

    jest.spyOn(utils, 'getUserRoleAndUnitFilterFromReq');
    utils.getUserRoleAndUnitFilterFromReq.mockImplementation(() => {
      return { idUnit: 1, idRole: 1 };
    });

    reqMock.query = { limit: 10, offset: 10 };
    await flowController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(MockResponse);
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  test('index - flows not found (500)', async () => {
    const mockFlowProcesses = [{ id: 1, idFlow: 1, name: 'Flow 1' }];
    const error = new Error('Internal Server Error');

    flowController.flowService.findAll = jest.fn().mockRejectedValue(error);

    reqMock.query = { limit: 10, offset: 10 };
    await flowController.index(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(error);
    expect(resMock.status).toHaveBeenCalledWith(500);
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
      const query_results = mockQueryResults;

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

  describe('showUserToNotify', () => {
    it('Encontrar usuários para notificá-los', async () => {
      reqMock.params = {idFlow: 1}

      const mockUsers = [{
        idFlow: 1,
        cpf: "03265224171",
        fullName: 'Leandro Almeida',
        email: 'leozin@email.com',
        idUnit: 1
      }]

      flowController.flowUserService.findUsersToNotify = jest
        .fn()
        .mockResolvedValue(mockUsers)

      await flowController.showUsersToNotify(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({usersToNotify: mockUsers});
    })

    it('Erro 500', async () => {
      reqMock.params = {idFlow: 1}

      const erro = new Error("internal server error");

      flowController.flowUserService.findUsersToNotify = jest
        .fn()
        .mockRejectedValue(erro)

      await flowController.showUsersToNotify(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: erro,
        message: 'Impossível obter usuários que devem ser notificados no fluxo',
      });
    })
  });

  describe('store', () => {
    it('', async () => {
      reqMock.body = {
        idUnit: 1,
        idUsersToNotify: ["12345678901"],
        name: "1",
        sequences: [
            {
                commentary: "",
                from: 15,
                to: 17
            }
        ]
      }
    const usersMock = { data: [{cpf: 12345678901, fullName: "Fulano da Silva"}],}
    axios.get.mockResolvedValue(usersMock);

    const flowMock = {idFlow: 1, name: "Fluxo 1"}
    const mock1 = { dataValues: {idStage: 1, name: "Etapa 1", duration: 1}}
    const mock2 = { dataValues: {idStage: 2, name: "Etapa 2", duration: 2}}

    const flowStageMock = { idFlow: 1, idStageA: 1, idStageB: 2, commentary: "" }
    const flowUserMock = { idFlow: 1, cpf: 12345678901 }

    flowController.stageService.findOneByStageId = jest
      .fn()
      .mockReturnValueOnce(mock1).mockReturnValueOnce(mock2)

    flowController.flowService.createFlow = jest
      .fn()
      .mockResolvedValue(flowMock)

    flowController.flowStageService.createFlowStage = jest
      .fn()
      .mockResolvedValue(flowStageMock)

    flowController.flowUserService.createFlowUser = jest
      .fn()
      .mockResolvedValue(flowUserMock)

      await flowController.store (reqMock, resMock)
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        idFlow: 1,
        name: "Fluxo 1",
        idUnit: 1,
        sequences: [
          {
              commentary: "",
              from: 15,
              to: 17
          }
        ],
        usersToNotify: ['12345678901'],
      });
    })

    it('Testando quando o user é inexistente', async () => {
      reqMock.body = {
        idUnit: 1,
        idUsersToNotify: ["12345678901"],
        name: "1",
        sequences: [
            {
                commentary: "",
                from: 15,
                to: 17
            }
        ]
      }
      const usersMock = {}
      axios.get.mockResolvedValue(usersMock);
    
      await flowController.store (reqMock, resMock)
      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({
        message: `Usuário '12345678901' não existe na unidade '1'`,
      });
    })

    it('Testando se existe sequência no fluxo', async () => {
      reqMock.body = {
        idUnit: 1,
        idUsersToNotify: ["12345678901"],
        name: "1",
        sequences: []
      }
      const usersMock = { data: [{cpf: 12345678901, fullName: "Fulano da Silva"}],}
      axios.get.mockResolvedValue(usersMock);
    
      await flowController.store(reqMock, resMock)
      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({
        message: `Necessário pelo menos duas etapas!`,
      });
    })

    it('Testando quando etapas são iguais', async () => {
      reqMock.body = {
        idUnit: 1,
        idUsersToNotify: [],
        name: "1",
        sequences: [{
          commentary: "",
          from: 15,
          to: 15
        }]
      }

      await flowController.store(reqMock, resMock)
      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({
        message: `Sequências devem ter início e fim diferentes`,
      });
    })

    it('Testanto se a 1° etapa existe', async () => {
      reqMock.body = {
        idUnit: 1,
        idUsersToNotify: [],
        name: "1",
        sequences: [{
          commentary: "",
          from: 15,
          to: 17
        }]
      }

      flowController.stageService.findOneByStageId = jest
      .fn()
      .mockReturnValueOnce({})


      await flowController.store(reqMock, resMock)
      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({
        message: `Não existe a etapa com identificador '15'`,
      });
    })

    it('Testando se a 2° etapa existe', async () => {
      reqMock.body = {
        idUnit: 1,
        idUsersToNotify: [],
        name: "1",
        sequences: [{
          commentary: "",
          from: 15,
          to: 17
        }]
      }

      const mock1 = { dataValues: {idStage: 1, name: "Etapa 1", duration: 1}}

      flowController.stageService.findOneByStageId = jest
      .fn()
      .mockReturnValueOnce(mock1).mockReturnValueOnce({})

      await flowController.store(reqMock, resMock)
      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({
        message: `Não existe a etapa com identificador '17'`,
      });
    })

    it('', async () => {
      reqMock.body = {
        idUnit: 1,
        idUsersToNotify: [],
        name: "1",
        sequences: [{
          commentary: "",
          from: 15,
          to: 17
        }]
      }

      const erro = new Error("internal server erro")

      flowController.stageService.findOneByStageId = jest
      .fn()
      .mockRejectedValue(erro)

      await flowController.store(reqMock, resMock)
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        message: `Erro ao criar fluxo`,
      });
    }) 
  });

  describe('update', () => {
    it('Testando atualizacao de fluxo com sucesso', async () => {
      reqMock.body = {
        name: "Fluxo 1",
        idFlow: 1,
        idUnit: 1,
        sequences: [
            {
                commentary: "",
                from: 15,
                to: 17
            }
        ],
        idUsersToNotify: ["12345678901"],
      }

      flowController.flowService.findOneByFlowId = jest
        .fn()
        .mockResolvedValue({idflow: 1, idUnit: 1, name: "Fluxo 1"})

      flowController.flowService.updateFlow = jest
        .fn()
        .mockResolvedValue({name: "Fluxo A",idFlow: "1"})
        
        const usersMock = { data: [{cpf: 12345678901, fullName: "Fulano da Silva"}],}
        axios.get.mockResolvedValue(usersMock);

        const mock1 = { dataValues: {idStage: 1, name: "Etapa 1", duration: 1}}
        const mock2 = { dataValues: {idStage: 2, name: "Etapa 2", duration: 2}}
    
        flowController.stageService.findOneByStageId = jest
          .fn()
          .mockReturnValueOnce(mock1).mockReturnValueOnce(mock2)
    
        flowController.flowStageService.deleteFlowStageByIdFlow = jest
          .fn()
          .mockResolvedValue(1)

        const flowStageMock = { idFlow: 1, idStageA: 1, idStageB: 2, commentary: "" }
        flowController.flowStageService.createFlowStage = jest
        .fn()
        .mockResolvedValue(flowStageMock)
        
        const flowUserMock = { idFlow: 1, cpf: 12345678901 }
        flowController.flowUserService.createFlowUser = jest
          .fn()
          .mockResolvedValue(flowUserMock)
    
        await flowController.update(reqMock, resMock)
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
          idFlow: updatedFlow.idFlow,
          name: updatedFlow.name,
          idUnit: idUnit,
          sequences,
          usersToNotify: idUsersToNotify,
        });
    })
  })
});
