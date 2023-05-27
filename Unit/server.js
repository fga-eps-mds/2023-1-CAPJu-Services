import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import routes from './src/routes/index.js';
import db from './src/config/database.js';

config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.log('Unable to connect to the database:', err);
  });

const listener = app.listen(process.env.PORT || 3000, () =>
  console.log('Server running'),
);

async function failGracefully() {
  listener.close();
  await Database.connection.close();
  process.exit(0);
}

process.on('SIGTERM', failGracefully);
process.on('SIGINT', failGracefully);
