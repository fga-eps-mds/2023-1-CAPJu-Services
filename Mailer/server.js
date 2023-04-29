import cron from "node-cron";
import db from "./src/database.js"
import * as mailer from "./src/mailer.js";

db.sync(() => console.log(`Banco de dados conectado: ${process.env.DB_NAME}`));

cron.schedule("0 0 0 * * *", () => {
  mailer.sendEmail();
});
