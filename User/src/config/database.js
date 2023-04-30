import 'dotenv/config';

const dbConfig = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DIALECT,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD
}

export default dbConfig;