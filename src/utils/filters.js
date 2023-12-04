import { Op } from 'sequelize';

export function filterByNicknameAndRecord(req) {
  return req.query.filter?.type === 'process'
    ? {
        [Op.or]: [
          { record: { [Op.like]: `%${req.query.filter.value}%` } },
          { nickname: { [Op.iLike]: `%${req.query.filter.value}%` } },
        ],
      }
    : {};
}

export function filterByStatus(req) {
  const { status } = req.query;

  if (status === undefined || status.length === 0) return {};
  return {
    [Op.and]: [{ [Op.or]: [...status.map(item => ({ status: item }))] }],
  };
}

export function filterByName(req) {
  return req.query.filter
    ? {
        [Op.or]: [{ name: { [Op.iLike]: `%${req.query.filter}%` } }],
      }
    : {};
}

export function filterByIdFlow(req) {
  return req.query.idFlow
    ? {
        idFlow: req.query.idFlow,
      }
    : {};
}

export function filterByFullName(req) {
  return req.query.filter?.type === 'user'
    ? {
        [Op.or]: [{ fullName: { [Op.iLike]: `%${req.query.filter.value}%` } }],
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
              [Op.iLike]: `%${req.query.nicknameOrRecordFilter.trim()}%`,
            },
          },
          {
            nickname: {
              [Op.iLike]: `%${req.query.nicknameOrRecordFilter.trim()}%`,
            },
          },
        ],
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

export function filterByFlowName(req, flows) {
  return req.query.filter?.type === 'flow'
    ? {
        [Op.or]: [...flows],
      }
    : {};
}

export function filterByStageName(req, stages) {
  return req.query.filter?.type === 'stage'
    ? {
        [Op.or]: [...stages],
      }
    : {};
}
