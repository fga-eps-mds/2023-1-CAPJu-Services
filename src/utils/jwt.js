import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const jwtToken = process.env.JWT_SECRET || 'capju_secret';

export const generateToken = id => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + parseInt(process.env.JWT_EXPIRATION_TIME_IN_MINUTES) * 60;
  return jwt.sign({ id, exp }, jwtToken);
};
