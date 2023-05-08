import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  dialect: "postgres",
  host: dbHost,
  port: dbPort,
});

export default sequelize;
