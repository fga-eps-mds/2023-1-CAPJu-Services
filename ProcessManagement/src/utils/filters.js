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

export function filterByStatusArchivedAndFinished(req) {
  return JSON.parse(req.query.showArchivedAndFinished)
    ? {
        [Op.or]: [
          { status: { [Op.like]: `archived` } },
          { status: { [Op.like]: `finished` } },
        ],
      }
    : {};
}

export function filterByStatusInProgressNotStarted(req) {
  return req.query.showInProgressAndNotStarted
    ? {
        [Op.or]: [
          { status: { [Op.like]: `inProgress` } },
          { status: { [Op.like]: `notStarted` } },
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
  return req.query.showArchivedAndFinished
    ? {
        [Op.or]: [
          { status: { [Op.like]: `%finished%` } },
          { status: { [Op.like]: `%archived%` } },
        ],
      }
    : {};
}

export function filterByLegalPriority(req) {
  return req.query.filter
    ? {
        [Op.or]: [{ legalPriority: { [Op.like]: ` %${req.query.filter}%` } }],
      }
    : {};
}

// export function filterByStatus(req) {
//   console('filtrando por status');
//   return req.query.filter
//     ? {
//         [Op.or]: [
//           { record: { [Op.like]: `%${req.query.filter}%` } },
//           { nickname: { [Op.like]: `%${req.query.filter}%` } },
//         ],
//       }
//     : {};
// }

// export function filterByLegalPriority(req) {
//   return req.query.filterByLegalPriority
//     ? {
//         [Op.or]: [
//           { idPriority: { [Op.not]: null } },
//         ],
//       }
//     : {
//       [Op.or]: [
//         { idPriority: { [Op.not]: 1 } },
//       ],
//     };
// }
