import 'dotenv/config';

const dbConfig = {
  dialect: 'postgres',
  timezone: 'America/Sao_Paulo',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

export default dbConfig;
