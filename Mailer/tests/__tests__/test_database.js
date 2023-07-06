import { Sequelize } from "sequelize";
import { config } from "dotenv";
import * as path from "path";
import sequelize from "../../src/config/database.js";

jest.mock("sequelize");

describe("database", () => {
  beforeAll(() => {
    const envTemplatePath = path.resolve(__dirname, "../../../.env-template");
    config({ path: envTemplatePath });
  });

  it("should create a Sequelize instance with the correct parameters", () => {
    const dbName = process.env.DB_NAME;
    const dbUser = process.env.DB_USER;
    const dbHost = process.env.DB_HOST;
    const dbPassword = process.env.DB_PASSWORD;
    const dbPort = process.env.DB_PORT;

    new Sequelize(dbName, dbUser, dbPassword, {
      dialect: "postgres",
      host: dbHost,
      port: dbPort,
    });

    expect(Sequelize).toHaveBeenCalledWith(
      dbName,
      dbUser,
      dbPassword,
      expect.objectContaining({
        dialect: "postgres",
        host: dbHost,
        port: dbPort,
      })
    );
  });

  it("should export the Sequelize instance", () => {
    expect(sequelize).toBeInstanceOf(Sequelize);
  });
});
