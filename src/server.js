import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import applicationRoutes from './routes/_index.js';
import sequelizeConfig from './config/sequelize.js';
import fileUpload from 'express-fileupload';
import cron from 'node-cron';
import services from "./services/_index.js";
import {logger} from "./utils/logger.js";

const app = express();
const port = process.env.API_PORT;

app.use(cors());
app.use(express.json());
app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 }, /* 10 MB limit */ }));
app.use('/', applicationRoutes);

sequelizeConfig.sync().then(() => {
  logger.info(`Conexão com o banco de dados ${process.env.DB_NAME}-${process.env.DB_HOST} na porta ${process.env.DB_PORT} realizada com sucesso!`);
});

const CRON_PATTERN = '0 */5 * * * *'; // Executado a cada 5min

const processesFileService = services.processesFileService;

cron.schedule(CRON_PATTERN, async () => {
  logger.info('Iniciando rotina de importação de processos');
  await processesFileService.executeJob();
});

app.listen(port, () => {
  logger.info(`Serviço de Gerenciamento de Processos - Escutando na porta ${port}!`);
});
