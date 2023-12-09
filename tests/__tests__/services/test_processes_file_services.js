import { ProcessesFileService } from "../../../src/services/processesFile";

const ProcessFileModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  count: jest.fn(),
};

describe('ProcessFileService', () => {
  let processFile;
  let reqMock;
  let resMock;

  beforeEach(() => {
    processFile = new ProcessesFileService(ProcessFileModel)
    reqMock = {};
    resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("run findAllPage correctly", async () => {
    const query = { offset: 0, limit: 10, nameOrRecord: "processos" }

    const process = {
      idProcessesFile: 1,
      name: "processo 1",
      fileName: "teste.xlsx",
      status: "updated",
      message: "mensagem teste",
      createdAt: "08/12/2023",
    }

    reqMock.query = query;
    processFile.processesFileRepository.findAll = jest.fn().mockResolvedValue(process)
    processFile.processesFileRepository.count = jest.fn().mockResolvedValue(20)

    const expected = {
      data: process, 
      pagination: {
        totalRecords: 20,
        totalPages: 2,
        currentPage: 1,
        perPage: 10,
      },
    }

    const result = await processFile.findAllPaged(reqMock)

    expect(result).toEqual(expected);
  })

  it("run findById correctly", async () => {
    const process = {
      idProcessesFile: 1,
      name: "processo 1",
      fileName: "teste.xlsx",
      status: "updated",
      message: "mensagem teste",
      createdAt: "08/12/2023",
    }

    processFile.processesFileRepository.findOne = jest.fn().mockResolvedValue(process)

    const result = await processFile.findById(1)

    expect(result).toEqual(process);
  }) 

  it("run findAllItemsPaged correctly", async () => {
    const query = { offset: 0, limit: 10, idProcessesFile: 1 }

    reqMock.query = query

    const process = {
      idProcessesFile: 1,
      name: "processo 1",
      fileName: "teste.xlsx",
      status: "updated",
      message: "mensagem teste",
      createdAt: "08/12/2023",
    }

    processFile.processesFileItemRepository.findAll = jest.fn().mockResolvedValue([ process ])
    processFile.processesFileItemRepository.count = jest.fn().mockResolvedValue(20)

    const expected = {
      data: [ process ], 
      pagination: {
        totalRecords: 20,
        totalPages: 2,
        currentPage: 1,
        perPage: 10,
      },
    }

    const result = await processFile.findAllItemsPaged(reqMock)

    expect(result).toEqual(expected);
  }) 
})