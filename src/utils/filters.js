import { Op } from 'sequelize';

export function filterByNicknameAndRecord(req) {
    console.log(req.query);
  return req.query.nicknameOrRecordFilter
    ? {
        [Op.or]: [
          { record: { [Op.like]: `%${req.query.nicknameOrRecordFilter}%` } },
          { nickname: { [Op.like]: `%${req.query.nicknameOrRecordFilter}%` } },
        ],
      }
    : {};
}

export function filterByStatus(req) {
  return JSON.parse(req.query.showArchivedAndFinished)
    ? {
        [Op.or]: [{ status: `archived` }, { status: `finished` }],
      }
    : {
        [Op.or]: [{ status: 'notStarted' }, { status: 'inProgress' }],
      };
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
    return {};
  }
}

export function filterByNicknameOrRecord(req) {
    return req.query.nicknameOrRecordFilter
        ? {
            [Op.or]: [
                { record: { [Op.like]: `%${req.query.nicknameOrRecordFilter.trim()}%` } },
                { nickname: { [Op.like]: `%${req.query.nicknameOrRecordFilter.trim()}%` } }
            ],
        }
        : {};
}
