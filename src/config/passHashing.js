import 'dotenv/config';

const passHashingParams = {
  hashLength: 50,
  saltLength: 16,
  type: 2,
  secret: Buffer.from(process.env.ARGON2_SECRET, 'utf-8'),
};

export default passHashingParams;
