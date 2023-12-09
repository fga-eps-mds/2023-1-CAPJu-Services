import { Op } from 'sequelize';

export function filterByFullName(req) {
  return req.query.filter
    ? {
        [Op.or]: [{ fullName: { [Op.iLike]: `%${req.query.filter}%` } }],
      }
    : {};
}
