import 'dotenv/config';
import {
  filterByNicknameAndRecord,
  filterByStatus,
  filterByName,
  filterByFullName,
  filterByLegalPriority,
  filterByIdFlow,
  filterByDateRange,
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
    reqMock.query = { filter: 13 };
    expect(filterByNicknameAndRecord(reqMock)).toStrictEqual({
      [Op.or]: [
        { record: { [Op.like]: `%${reqMock.query.filter}%` } },
        { nickname: { [Op.like]: `%${reqMock.query.filter}%` } },
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
      [Op.or]: [...reqMock.query.status.map(item => ({ status: item }))],
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
    reqMock.query = { filter: 'Fulano' };
    expect(filterByFullName(reqMock)).toStrictEqual({
      [Op.or]: [{ fullName: { [Op.like]: `%${reqMock.query.filter}%` } }],
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
          new Date(reqMock.query.to),
        ],
      },
    });
  });
});