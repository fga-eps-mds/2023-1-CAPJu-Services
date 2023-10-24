import 'dotenv/config';
import jwt from "jsonwebtoken"
import { QueryTypes } from "sequelize";
import sequelizeConfig from '../src/config/sequelize.js';

async function tokenToUser(req, res) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET).id;

      const userData = await sequelizeConfig.query(
          `select * from users u where cpf = :cpf limit 1`,
          {
            type: QueryTypes.SELECT,
            replacements: { cpf: decoded.cpf },
            logging: false,
          }
      );
      
      if (userData[0].accepted === false) {
        throw new Error();
      }
      return userData[0]; 
      
    } catch (error) {
      return res.status(401);
    }
  }
}

async function authenticate(req, res, next) {

  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {

    const token = req.headers.authorization.split(" ")[1];

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET).id;

    const userData = await sequelizeConfig.query(
        `select * from users u where cpf = :cpf limit 1`,
        {
          type: QueryTypes.SELECT,
          replacements: { cpf: decodedUser.cpf },
          logging: false
        }
    );

    if (!userData) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (userData[0].accepted === false) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    return res.status(401).json({ message: 'Authentication failed' });
  }
}

function authorize(permissionName) {
  return async (req, res, next) => {

    try {
      const user = await userFromReq(req);

      if (!user.role.allowedActions.includes(permissionName)) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}

async function userFromReq(req) {
  const token = req.headers.authorization.split(" ")[1];
  return jwt.decode(token).id;
}

async function getUserRoleAndUnitFilterFromReq(req) {
  const userInfo = await userFromReq(req);
  const idRole = userInfo.role.idRole;
  const idUnit = userInfo.unit.idUnit;

  if (idRole === 5)
    return { idUnit };
  else
    return { idRole, idUnit };
}

export { tokenToUser, authenticate, authorize, userFromReq, getUserRoleAndUnitFilterFromReq };
