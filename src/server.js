import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import applicationRoutes from './routes/_index.js';
import sequelizeConfig from './config/sequelize.js';
import { authenticate } from '../middleware/authMiddleware.js';
import requestIp from 'request-ip';
import services from './services/_index.js';
import cron from 'node-cron';
import { logger } from './utils/logger.js';

const app = express();
const port = process.env.API_PORT;

app.use(requestIp.mw());
app.use(cors());
app.use(express.json());
app.use(authenticate);
app.use('/', applicationRoutes);

sequelizeConfig.sync().then(() => {
  console.info(
    `Conexão com o banco de dados ${process.env.DB_NAME}-${process.env.DB_HOST} na porta ${process.env.DB_PORT} realizada com sucesso!`,
  );
});

const CRON_PATTERN = '0 */5 * * * *'; // Executada a cada 5min

const userAccessLogService = services.userAccessLogService;

cron.schedule(CRON_PATTERN, async () => {
  logger.info('Iniciando rotina de limpeza de sessões expiradas');
  await userAccessLogService.clearExpiredSessions({
    message: 'Encerrada pela rotina',
  });
});

app.listen(port, () => {
  console.info(`Escutando na porta ${port}! \n`);
});
