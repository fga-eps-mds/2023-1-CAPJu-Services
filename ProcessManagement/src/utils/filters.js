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

export function filterByStatus(req) {
  return JSON.parse(req.query.showArchivedAndFinished)
    ? {
        [Op.or]: [
          { status: { [Op.like]: 'archived' } },
          { status: { [Op.like]: 'finished' } },
        ],
      }
    : {
        [Op.or]: [
          { status: { [Op.like]: 'inProgress' } },
          { status: { [Op.like]: 'notStarted' } },
        ],
      };
}

export function filterByLegalPriority(req) {
  return JSON.parse(req.query.filterByLegalPriority)
    ? {
        [Op.or]: [
          { idPriority: { [Op.is]: null } },
          { idPriority: { [Op.is]: 0 } },
        ],
      }
    : {};
}
