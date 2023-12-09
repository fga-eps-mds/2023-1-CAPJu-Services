import { UnitService } from '../../../src/services/unit';

describe('UnitService', () => {
  let unitService;

  const UnitModel = {
    findAll: jest.fn(),
  };

  beforeEach(() => {
    unitService = new UnitService(UnitModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('with attributes is empty', async () => {
    const where = {};
    const attributes = {};
    const query = [
      {
        idProcess: 1,
        nickname: 'processo 1',
        record: '1234567890',
        priority: 1,
        idFlow: 1,
      },
    ];

    unitService.repository.findAll = jest.fn().mockResolvedValue(query);

    const result = await unitService.findAll(where, attributes);

    console.log(result);

    expect(result).toEqual([
      {
        idProcess: 1,
        nickname: 'processo 1',
        record: '1234567890',
        priority: 1,
        idFlow: 1,
      },
    ]);
  });

  it('with attributes not empty', async () => {
    const where = {};
    const attributes = [
      {
        idProcess: 1,
        nickname: 'processo 1',
        record: '1234567890',
        priority: 1,
        idFlow: 1,
      },
      {
        idProcess: 2,
        nickname: 'processo 2',
        record: '1234567890',
        priority: 1,
        idFlow: 1,
      },
    ];

    const query = [
      {
        idProcess: 1,
        nickname: 'processo 1',
        record: '1234567890',
        priority: 1,
        idFlow: 1,
      },
    ];

    unitService.repository.findAll = jest.fn().mockResolvedValue(query);

    const result = await unitService.findAll(where, attributes);

    expect(result).toEqual([
      {
        idProcess: 1,
        nickname: 'processo 1',
        record: '1234567890',
        priority: 1,
        idFlow: 1,
      },
    ]);
  });
});
