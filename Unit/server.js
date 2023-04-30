import express from "express"
import db from "./src/database.js"

const app = express();
const port = process.env.APP_PORT || 3000;

db.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.log('Unable to connect to the database:', err);
    });

app.get("/", async (req, res) => {
  const resData = await db.query('show tables');
  res.send(`${resData}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
