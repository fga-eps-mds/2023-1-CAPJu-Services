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
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userData = await sequelizeConfig.query(`select * \ 
      from \
          users u \
      where \
          cpf = '${decoded.id}'`, {
        type: QueryTypes.SELECT,
      });
      
      if (userData[0].accepted === false) {
        throw new Error();
      }
      return userData[0]; 
      
    } catch (error) {
      return res.status(401);
    }
  }
}
export { tokenToUser };
