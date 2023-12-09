import { ProcessesFileService } from "../../../src/services/processesFile";
import xlsx from 'node-xlsx';
import XLSX from 'xlsx-js-style';

jest.mock("../../../src/config/sequelize", () => ({
  transaction: jest.fn().mockImplementation((transactionCallback) => {
    transactionCallback();
  })
}))

jest.mock("../../../src/models/_index", () => ({
  ProcessAud: {
    bulkCreate: jest.fn().mockResolvedValue([])
  },
  Process: { 
    bulkCreate: jest.fn().mockResolvedValue([])
  }
}))

jest.mock('node-xlsx', () => ({
  parse: jest.fn().mockResolvedValue([{
    name: 'mySheetName',
    data: [
      ['Processos', 'Apelido', 'Fluxo', 'Prioridade'],
      ["41520545620233004644", "teste1", "Fluxo 1", 1],
    ]}
  ])
}))

jest.mock('xlsx-js-style', () => ({
  utils: { 
    book_new: jest.fn().mockResolvedValue({}),
    aoa_to_sheet: jest.fn().mockResolvedValue({ '!cols': [] }),
    book_append_sheet: jest.fn(),
  },
  write: jest.fn().mockResolvedValue([0x62, 0x75, 0x66, 0x66, 0x65, 0x72])
}))

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

    processFile.processesFileItemRepository = { 
      findAll: jest.fn().mockResolvedValue([ process ]),
      count: jest.fn().mockResolvedValue(20)
    }

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

  it("run executeJob correctly", async () => {
    const files = [{ idProcessesFile: 1, fileName: "test1", dataOriginalFile: "./myFile.xlsx" }]

    processFile.processesFileRepository.findAll = jest.fn().mockResolvedValue(files)
    processFile.processesFileRepository.update = jest.fn()
    processFile.flowService.findAllRawWithAttributes = jest.fn().mockResolvedValue([{ idFlow: 1, idUnit: 1, name: "Fluxo 1" }])
    processFile.validateRecord = jest.fn().mockResolvedValue({ filteredRecord: "41520545620233004644", valid: true })
    processFile.getPriorityIdByDescriptionOrAbbreviation = jest.fn().mockResolvedValue(1)

    processFile.processesFileItemRepository = {
      bulkCreate: jest.fn()
    }

    processFile.executeJob()

    expect(processFile.processesFileRepository.findAll).toHaveBeenCalled()
  })
})