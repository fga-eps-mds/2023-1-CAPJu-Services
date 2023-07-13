import controllers from '../../src/controllers/_index.js'
import services from '../../src/services/_index.js';
import axios from "axios";
import models from '../../src/models/_index.js';
import { FlowController } from '../../src/controllers/flow.js';
import FlowService from '../../src/services/flow.js';

jest.mock("axios");

// const reqMock = {};
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

// describe('FlowController', () => {
//   let flowController;
//   let flowServiceMock;
//   let reqMock;
//   let resMock;
//   let FlowModelMock = {
//   findAll: jest.fn(),
//   findOne: jest.fn(),
//   create: jest.fn(),
//   update: jest.fn(),
//   destroy: jest.fn(),
// };
// });


//   beforeEach(() => {
//     flowServiceMock = new FlowService(models.Flow);
//     flowController = new FlowController(flowServiceMock);
//     flowController.flowService = flowServiceMock;
//     reqMock = {
//       body: {},
//       params: {},
//     };
//     resMock = {
//       json: jest.fn(),
//       status: jest.fn(() => resMock),
//     };
//     flowService = new FlowService(FlowModelMock);
//   });

  describe("flow endpoints", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

  let flowController;
  let flowServiceMock;
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
    flowController = new FlowController();
    flowController.flowService = flowServiceMock;
  });

  
    test("index - list all flows (500)", async () => {
      services.flowService.findAll = jest.fn().mockResolvedValue([]);
      services.flowService.countRows = jest.fn().mockResolvedValue(0);

      // const users = [
      //   { id: 1, name: 'John Doe' },
      //   { id: 2, name: 'Jane Smith' },
      // ];
      const flows =  [{idFlow: 1, name: 'flow x'}, {idFlow: 2, name: 'flow y'}]
      flowServiceMock.findAll = jest.fn().mockResolvedValue(flows);
      flowServiceMock.findAllByIdFlow  = jest.fn().mockResolvedValue([]);
      //  flowServiceMock.countRows = jest.fn().mockResolvedValue(2);

      // userServiceMock.getAllUsers = jest.fn().mockResolvedValue(users);
  
      reqMock.query = {
        limit: 1,
        offset: 0,
        filter: 0,
      };

      await controllers.flowController.index(reqMock, resMock);
  
      // expect(resMock.json).toHaveBeenCalledWith({ flows: [], totalPages: 0 });
      expect(resMock.status).toHaveBeenCalledWith(200);
    });
  });
});
