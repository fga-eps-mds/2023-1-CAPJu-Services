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
  if (req.query.filterByLegalPriority == 'true') {
    return { idPriority: { [Op.not]: 0 } };
  } else {
    return { idPriority: { [Op.not]: null } };
  }
}

export function filterByIdFlow(req) {
  return req.query.idFlow
    ? {
        idFlow: req.query.idFlow,
      }
    : {};
}

export function filterByDateRange(req) {
  const { from, to } = req.query;

  if (to === undefined || from === undefined) return {};
  return {
    effectiveDate: {
      [Op.between]: [new Date(from), new Date(to + ' 23:59:59.000+00')],
    },
  };
}
