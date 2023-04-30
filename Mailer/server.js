import cron from "node-cron";
import db from "./src/database.js"
import * as mailer from "./src/mailer.js";

db.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.log('Unable to connect to the database:', err);
    });

cron.schedule("0 0 0 * * *", () => {
  mailer.sendEmail();
});
