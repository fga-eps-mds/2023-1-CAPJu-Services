<<<<<<< HEAD
import { Op } from 'sequelize';
=======
import { Op } from "sequelize";
>>>>>>> Atualiza process do processManagement e cria seed de usuario

export function filterByNicknameAndRecord(req) {
  return req.query.filter
    ? {
        [Op.or]: [
          { record: { [Op.like]: `%${req.query.filter}%` } },
          { nickname: { [Op.like]: `%${req.query.filter}%` } },
        ],
      }
    : {};
<<<<<<< HEAD
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
=======
}
>>>>>>> Atualiza process do processManagement e cria seed de usuario
