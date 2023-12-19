import 'dotenv/config';
import jwt from 'jsonwebtoken';
import moment from 'moment-timezone';

export const jwtToken = process.env.JWT_SECRET || 'capju_secret';

export const generateToken = id => {
  const iat = moment().tz('America/Sao_Paulo').unix();
  const exp =
    iat + parseInt(process.env.JWT_EXPIRATION_TIME_IN_MINUTES || 600) * 60;
  return jwt.sign({ id, exp }, jwtToken);
};
