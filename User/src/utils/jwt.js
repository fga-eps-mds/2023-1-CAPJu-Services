import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const jwtToken = process.env.JWT_SECRET || 'ABC';

export const generateToken = id => {
  return jwt.sign({ id }, jwtToken, {
    expiresIn: '3d',
  });
};
