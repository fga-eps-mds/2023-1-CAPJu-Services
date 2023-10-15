import 'dotenv/config';
import jwt from "jsonwebtoken"
import { QueryTypes } from "sequelize";
import sequelizeConfig from '../config/sequelize.js';

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
          replacements: { cpf: decodedUser.cpf }
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

async function userFromReq(req) {
  const token = req.headers.authorization.split(" ")[1];
  return jwt.decode(token).id;
}

export { authenticate, userFromReq };
