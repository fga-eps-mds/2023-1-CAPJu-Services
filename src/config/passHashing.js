import 'dotenv/config';

const argon = process.env.ARGON2_SECRET || 'capju_argon2_secret';

const passHashingParams = {
  hashLength: 50,
  saltLength: 16,
  type: 2,
  secret: Buffer.from(argon, 'utf-8'),
};

export default passHashingParams;
