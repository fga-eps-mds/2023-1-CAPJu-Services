import controllers from '../../src/controllers/_index.js'
import services from '../../src/services/_index.js';
import axios from "axios";
import models from '../../src/models/_index.js';
import { FlowController } from '../../src/controllers/flow.js';
import FlowService from '../../src/services/flow.js';
import FlowStageService from '../../src/services/flowStage.js'
import { FlowStageController } from '../../src/controllers/flowStage.js';

jest.mock("axios");

const reqMock = {
  body: {idUnit: 1, idRole: 1},
  params: {},
};

const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("flow endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  describe("flow endpoints", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

  let flowController;
  let flowServiceMock;
  let flowStageServiceMock;
  const reqMock = {
    body: {idUnit: 1, idRole: 1},
    params: {},
  };
  
  const resMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    flowServiceMock = new FlowService(models.Flow);
    flowStageServiceMock = new FlowStageService(models.FlowStage)
    flowController = new FlowController();
    flowController.flowService = flowServiceMock;
    
    // flowStageController.flowStageService = new FlowStageController();
    // flowStageController.flowStageService = flowServiceMock;


  });

  
    test("index - list all flows (500)", async () => {

      const mockFlows = [
        { idFlow: 1, name: 'Flow 1', idUnit: 1 },
        { idFlow: 2, name: 'Flow 2', idUnit: 1 },
      ];

      const mockFlow = {}
      const mockFlowStages = [
        { idFlow: 1, idStageA: 1, idStageB: 2 },
        { idFlow: 1, idStageA: 2, idStageB: 3 },
      ];
      const mockStages = [
        { idStage: 1, name: 'Stage 1' },
        { idStage: 2, name: 'Stage 2' },
        { idStage: 3, name: 'Stage 3' },
        { idStage: 4, name: 'Stage 4' },
      ];
      const mockSequences = [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
      ];

      services.flowService.findAll = jest.fn().mockResolvedValue(mockFlows);
      services.flowService.countRows = jest.fn().mockResolvedValue(2);


      const flows =  [{idFlow: 1, name: 'flow x'}, {idFlow: 2, name: 'flow y'}]
      flowServiceMock.findAll = jest.fn().mockResolvedValue(mockFlows);
      flowStageServiceMock.findAllByIdFlow  = jest.fn().mockResolvedValue(mockFlowStages);
      // flowStageServiceMock.findAllByIdFlow  = jest.fn().mockResolvedValue(mockFlowStages);
      flowServiceMock.stagesSequencesFromFlowStages = jest.fn().mockResolvedValue({ stages: mockStages, sequences: mockSequences })
      // flowController.flowService.stagesSequencesFromFlowStages = jest
      // .fn()
      // .mockResolvedValue({ stages: mockStages, sequences: mockSequences });

  
      reqMock.query = {
        limit: 1,
        offset: 0,
        filter: 0,
      };

      await controllers.flowController.index(reqMock, resMock);
  
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    test("showByProcessRecord - show flow by process record (500)", async () => {
      services.flowService.findAll = jest.fn().mockResolvedValue([]);
      services.flowService.countRows = jest.fn().mockResolvedValue(0);

      const flows =  [{idFlow: 1, name: 'flow x'}, {idFlow: 2, name: 'flow y'}]
      flowServiceMock.findAll = jest.fn().mockResolvedValue(flows);
      flowServiceMock.findAllByIdFlow  = jest.fn().mockResolvedValue([]);
      reqMock.query = {
        limit: 1,
        offset: 0,
        filter: 0,
      };

      await controllers.flowController.showByProcessRecord(reqMock, resMock);
  
      expect(resMock.status).toHaveBeenCalledWith(500);
    });

    test("showByFlowId - show flow by flow id (500)", async () => {
      services.flowService.findAll = jest.fn().mockResolvedValue([]);
      services.flowService.countRows = jest.fn().mockResolvedValue(0);

      const flows =  [{idFlow: 1, name: 'flow x'}, {idFlow: 2, name: 'flow y'}]
      flowServiceMock.findAll = jest.fn().mockResolvedValue(flows);
      flowServiceMock.findAllByIdFlow  = jest.fn().mockResolvedValue([]);
      reqMock.query = {
        limit: 1,
        offset: 0,
        filter: 0,
      };

      await controllers.flowController.showByFlowId(reqMock, resMock);
  
      expect(resMock.status).toHaveBeenCalledWith(500);
    }
    );

    it('should return 404 when flow is not found', async () => {
      const flowId = 1;
      const flow = null;
      flowServiceMock.findOneByFlowId = jest.fn().mockResolvedValue(flow);
      await flowController.showByFlowId(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(404);
    });

    it('should return 200 when flow is found', async () => {
      const flowId = 1;
      const flow = {idFlow: 1, name: 'flow x'};
      flowServiceMock.findOneByFlowId = jest.fn().mockResolvedValue(flow);
      await flowController.showByFlowId(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(500);
    });

    test("update - update flow (500)", async () => {
      services.flowService.findAll = jest.fn().mockResolvedValue([]);
      services.flowService.countRows = jest.fn().mockResolvedValue(0);

      const flows =  [{idFlow: 1, name: 'flow x'}, {idFlow: 2, name: 'flow y'}]
      flowServiceMock.findAll = jest.fn().mockResolvedValue(flows);
      flowServiceMock.findAllByIdFlow  = jest.fn().mockResolvedValue([]);
      reqMock.query = {
        limit: 1,
        offset: 0,
        filter: 0,
      };

      await controllers.flowController.update(reqMock, resMock);
  
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
    it ('should return 404 when flow is not found', async () => {
      const flowId = 1;
      const flow = null;
      flowServiceMock.findOneByFlowId = jest.fn().mockResolvedValue(flow);
      await flowController.update(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(404);
    });
    it ('should return 200 when flow is found', async () => {
      const flowId = 1;
      const flow = {idFlow: 1, name: 'flow x'};
      flowServiceMock.findOneByFlowId = jest.fn().mockResolvedValue(flow);
      await flowController.update(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(404);
    });

    test("delete - delete flow (500)", async () => {
      services.flowService.findAll = jest.fn().mockResolvedValue([]);
      services.flowService.countRows = jest.fn().mockResolvedValue(0);

      const flows =  [{idFlow: 1, name: 'flow x'}, {idFlow: 2, name: 'flow y'}]
      flowServiceMock.findAll = jest.fn().mockResolvedValue(flows);
      flowServiceMock.findAllByIdFlow  = jest.fn().mockResolvedValue([]);
      reqMock.query = {
        limit: 1,
        offset: 0,
        filter: 0,
      };

      await controllers.flowController.delete(reqMock, resMock);
  
      expect(resMock.status).toHaveBeenCalledWith(500);
    }
    );

    test("showByFlowIdWithSequence - show flow by flow id with sequence (500)", async () => {
      services.flowService.findAll = jest.fn().mockResolvedValue([]);
      services.flowService.countRows = jest.fn().mockResolvedValue(0);

      const flows =  [{idFlow: 1, name: 'flow x'}, {idFlow: 2, name: 'flow y'}]
      flowServiceMock.findAll = jest.fn().mockResolvedValue(flows);
      flowServiceMock.findAllByIdFlow  = jest.fn().mockResolvedValue([]);
      reqMock.query = {
        limit: 1,
        offset: 0,
        filter: 0,
      };

      await controllers.flowController.showByFlowIdWithSequence(reqMock, resMock);
  
      expect(resMock.status).toHaveBeenCalledWith(500);
    }
    );
    it ('should return 404 when flow is not found', async () => {
      const flowId = 1;
      const flow = null;
      flowServiceMock.findOneByFlowId = jest.fn().mockResolvedValue(flow);
      await flowController.showByFlowIdWithSequence(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(404);
    }
    );
  });
});
