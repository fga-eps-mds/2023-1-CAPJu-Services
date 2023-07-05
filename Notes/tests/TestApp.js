import express from "express";
import cors from "cors";
import routes from "../src/routes/_index.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

let database;

function injectDB(db) {
  database = db;

  database
    .checkConnection()
    .catch((error) => console.log(error));
}

export { app, injectDB };
