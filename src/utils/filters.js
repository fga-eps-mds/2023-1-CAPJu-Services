import { Op } from 'sequelize';

export function filterByNicknameAndRecord(req) {
  return req.query.filter
    ? {
        [Op.or]: [
          { record: { [Op.like]: `%${req.query.filter}%` } },
          { nickname: { [Op.like]: `%${req.query.filter}%` } },
        ],
      }
    : {};
}

export function filterByStatus(req) {
  const { status } = req.query;

  if (status === undefined || status.length === 0) return {};
  return { [Op.or]: [...status.map(item => ({ status: item }))] };
}

export function filterByName(req) {
  return req.query.filter
    ? {
        [Op.or]: [{ name: { [Op.like]: `%${req.query.filter}%` } }],
      }
    : {};
}

export function filterByFullName(req) {
  return req.query.filter
    ? {
        [Op.or]: [{ fullName: { [Op.like]: `%${req.query.filter}%` } }],
      }
    : {};
}

export function filterByLegalPriority(req) {
  if (req.query.filterByLegalPriority === 'true') {
    return { idPriority: { [Op.not]: 0 } };
  } else {
    return { idPriority: { [Op.not]: null } };
  }
}

export function filterByNicknameOrRecord(req) {
  return req.query.nicknameOrRecordFilter
    ? {
        [Op.or]: [
          {
            record: {
              [Op.like]: `%${req.query.nicknameOrRecordFilter.trim()}%`,
            },
          },
          {
            nickname: {
              [Op.like]: `%${req.query.nicknameOrRecordFilter.trim()}%`,
            },
          },
        ],
      }
    : {};
}
