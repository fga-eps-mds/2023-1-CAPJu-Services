import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const jwtToken = process.env.JWT_SECRET || 'ABC';

export const generateToken = id => {
  return jwt.sign({ id }, jwtToken, {
    expiresIn: process.env.JWT_EXPIRATION_TIME_IN_MINUTES + 'min',
  });
};
