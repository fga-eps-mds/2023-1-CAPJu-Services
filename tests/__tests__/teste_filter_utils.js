import 'dotenv/config';
import {
  filterByNicknameAndRecord,
  filterByStatus,
  filterByName,
  filterByFullName,
  filterByLegalPriority,
  filterByIdFlow,
  filterByDateRange,
  filterByFlowName,
  filterByStageName,
} from '../../src/utils/filters';
import { Op } from 'sequelize';

// filterByIdFlow,

const reqMock = { body: {}, params: {} };

describe('filterByNicknameAndRecord', () => {
  test('Returns empty', () => {
    reqMock.query = { filter: undefined };
    expect(filterByNicknameAndRecord(reqMock)).toStrictEqual({});
  });
  test('Returns filter', () => {
    reqMock.query = { filter: { type: 'process', value: 13 } };
    expect(filterByNicknameAndRecord(reqMock)).toStrictEqual({
      [Op.or]: [
        { record: { [Op.like]: `%${reqMock.query.filter.value}%` } },
        { nickname: { [Op.like]: `%${reqMock.query.filter.value}%` } },
      ],
    });
  });
});

describe('filterByStatus', () => {
  test('Returns empty', () => {
    reqMock.query = {};
    expect(filterByStatus(reqMock)).toStrictEqual({});
    reqMock.query = { status: [] };
    expect(filterByStatus(reqMock)).toStrictEqual({});
  });

  test('Returns status filter', () => {
    reqMock.query = { status: ['status 1', 'status 2'] };
    expect(filterByStatus(reqMock)).toStrictEqual({
      [Op.and]: [
        { [Op.or]: [...reqMock.query.status.map(item => ({ status: item }))] },
      ],
    });
  });
});

describe('filterByName', () => {
  test('Returns empty', () => {
    reqMock.query = { filter: undefined };
    expect(filterByName(reqMock)).toStrictEqual({});
  });

  test('Returns Filter by name', () => {
    reqMock.query = { filter: 'Fulano' };
    expect(filterByName(reqMock)).toStrictEqual({
      [Op.or]: [{ name: { [Op.like]: `%${reqMock.query.filter}%` } }],
    });
  });
});

describe('filterByFullName', () => {
  test('Returns empty', () => {
    reqMock.query = { filter: undefined };
    expect(filterByFullName(reqMock)).toStrictEqual({});
  });

  test('Returns Filter by fullname', () => {
    reqMock.query = { filter: { type: 'user', value: 'Fulano' } };
    expect(filterByFullName(reqMock)).toStrictEqual({
      [Op.or]: [{ fullName: { [Op.like]: `%${reqMock.query.filter.value}%` } }],
    });
  });
});

describe('filterByLegalPriority', () => {
  test("filterByLegalPriority is 'true'", () => {
    reqMock.query = { filterByLegalPriority: 'true' };
    expect(filterByLegalPriority(reqMock)).toStrictEqual({
      idPriority: { [Op.not]: 0 },
    });
  });

  test("filterByLegalPriority is not 'true'", () => {
    reqMock.query = { filterByLegalPriority: 'false' };
    expect(filterByLegalPriority(reqMock)).toStrictEqual({
      idPriority: { [Op.not]: null },
    });
  });

  test('filterByLegalPriority is undefined', () => {
    reqMock.query = {};
    expect(filterByLegalPriority(reqMock)).toStrictEqual({
      idPriority: { [Op.not]: null },
    });
  });
});

describe('filterByIdFlow', () => {
  test('idFlow is defined', () => {
    reqMock.query = { idFlow: 1 };
    expect(filterByIdFlow(reqMock)).toStrictEqual({
      idFlow: reqMock.query.idFlow,
    });
  });

  test('idFlow is undefined', () => {
    reqMock.query = { idFlow: undefined };
    expect(filterByIdFlow(reqMock)).toStrictEqual({});
  });
});

describe('filterByDateRange', () => {
  test('to and/or from is undefined', () => {
    reqMock.query = {};
    expect(filterByDateRange(reqMock)).toStrictEqual({});

    reqMock.query = { to: '10-10-2023', from: undefined };
    expect(filterByDateRange(reqMock)).toStrictEqual({});

    reqMock.query = { from: '10-10-2023', to: undefined };
    expect(filterByDateRange(reqMock)).toStrictEqual({});
  });

  test('to and from are valid', () => {
    reqMock.query = { to: '10-10-2023', from: '9-9-2023' };
    expect(filterByDateRange(reqMock)).toStrictEqual({
      effectiveDate: {
        [Op.between]: [
          new Date(reqMock.query.from),
          new Date(reqMock.query.to + " 23:59:59.000+00"),
        ],
      },
    });
  });
});

describe('filterByFlowName', () => {
  test('filter is undefined', () => {
    reqMock.query = { filter: undefined };
    const flowsMock = undefined;
    expect(filterByFlowName(reqMock, flowsMock)).toStrictEqual({});
  });

  test('filter is defined and have one flow', () => {
    reqMock.query = { filter: { type: 'flow', value: 'primeiro' } };
    const flowsMock = [{ idFlow: 1 }];
    expect(filterByFlowName(reqMock, flowsMock)).toStrictEqual({
      [Op.or]: [...flowsMock],
    });
  });

  test('filter is defined and have two or more flows', () => {
    reqMock.query = { filter: { type: 'flow', value: 'Nome Parecido' } };
    const flowsMock = [{ idFlow: 1 }, { idFlow: 2 }];
    expect(filterByFlowName(reqMock, flowsMock)).toStrictEqual({
      [Op.or]: [...flowsMock],
    });
  });
});

describe('filterByStageName', () => {
  test('filter is undefined', () => {
    reqMock.query = { filter: undefined };
    const stagesMock = undefined;
    expect(filterByStageName(reqMock, stagesMock)).toStrictEqual({});
  });

  test('filter is defined and have one stage', () => {
    reqMock.query = { filter: { type: 'stage', value: 'primeiro' } };
    const stagesMock = [{ idStage: 1 }];
    expect(filterByStageName(reqMock, stagesMock)).toStrictEqual({
      [Op.or]: [...stagesMock],
    });
  });

  test('filter is defined and have two or mode stages', () => {
    reqMock.query = { filter: { type: 'stage', value: 'Nome Parecido' } };
    const stagesMock = [{ idStage: 1 }, { idStage: 2 }];
    expect(filterByStageName(reqMock, stagesMock)).toStrictEqual({
      [Op.or]: [...stagesMock],
    });
  });
});
