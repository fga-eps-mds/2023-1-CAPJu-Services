import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import applicationRoutes from './routes/_index.js';
import sequelizeConfig from './config/sequelize.js';
import fileUpload from 'express-fileupload';
import cron from 'node-cron';
import pino from 'pino';
import services from "./services/_index.js";

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      levelFirst: true,
      translateTime: false,
      ignore: 'pid,hostname,time',
      messageFormat: '{msg}',
    }
  },
});

const app = express();
const port = process.env.API_PORT;

app.use(cors());
app.use(express.json());
app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 }, /* 10 MB limit */ }));
app.use('/', applicationRoutes);

sequelizeConfig.sync().then(() => {
  logger.info(`Conexão com o banco de dados ${process.env.DB_NAME}-${process.env.DB_HOST} na porta ${process.env.DB_PORT} realizada com sucesso!`);
});

const CRON_PATTERN = '*/5 * * * * *';

const processesFileService = services.processesFileService;

cron.schedule(CRON_PATTERN, async () => {
  logger.info('Iniciando rotina de importação de processos');
  await processesFileService.executeJob();
});

app.listen(port, () => {
  logger.info(`Serviço de Gerenciamento de Processos - Escutando na porta ${port}!`);
});
