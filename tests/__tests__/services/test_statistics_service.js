import sequelizeConfig from '../../../src/config/sequelize';
import StatisticsService from '../../../src/services/statistics';

jest.mock('../../../src/config/sequelize.js', () => ({
  query: jest
    .fn()
    .mockResolvedValue([
      {
        idProcess: 1,
        nickname: 'processo 1',
        record: '1234567890',
        priority: 1,
        idFlow: 1,
      },
    ]),
}));

describe('StatisticsService', () => {
  let statisticsService;

  beforeEach(() => {
    statisticsService = new StatisticsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('return processes searchDueDate', async () => {
    const minDate = new Date().toString();
    const maxDate = new Date().toString();
    const offSet = 0;
    const limit = 0;

    const result = await statisticsService.SearchDueDate(
      minDate,
      maxDate,
      offSet,
      limit,
    );

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

  it('return processes countRowsDueDate', async () => {
    const minDate = new Date().toString();
    const maxDate = new Date().toString();
    const offSet = 0;
    const limit = 0;

    const result = await statisticsService.countRowsDueDate(
      minDate,
      maxDate,
      offSet,
      limit,
    );

    expect(result).toEqual(1);
  });
});
