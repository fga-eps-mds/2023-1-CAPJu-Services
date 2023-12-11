import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const jwtToken = process.env.JWT_SECRET || 'capju_secret';

export const generateToken = id => {
  return jwt.sign({ id }, jwtToken, {
    expiresIn: '1d',
  });
};
