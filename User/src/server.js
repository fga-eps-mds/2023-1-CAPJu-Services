import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import applicationRoutes from './routes/index.js';
import sequelizeConfig from './config/sequelize.js';

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use('/', applicationRoutes);

sequelizeConfig.sync().then(() => {
  console.info(
    `Conexão com o banco de dados ${process.env.DB_NAME}-${process.env.DB_HOST} na porta ${process.env.DB_PORT} realizada com sucesso!`
  );
});

app.listen(port, () => {
  console.info(`Escutando na porta ${port}! \n`);
});
