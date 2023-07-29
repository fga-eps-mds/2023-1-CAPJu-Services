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
  if (req.query.filterByLegalPriority == 'true') {
    return { idPriority: { [Op.not]: 0 } };
  } else {
    return { idPriority: { [Op.not]: null } };
  }
}
