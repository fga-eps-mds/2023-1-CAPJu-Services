import express from 'express';
const StatisticsRoutes = express.Router();
import controllers from '../controllers/_index.js';

StatisticsRoutes.get(
    '/ProcessByStage/:idFlow/:idStage',
    controllers.statisticsController.getProcessByStepInFlow,
);

StatisticsRoutes.get(
    '/qtdFlow/:idFlow',
    controllers.statisticsController.getProcessCountByStepInFlow,
);


export default StatisticsRoutes;