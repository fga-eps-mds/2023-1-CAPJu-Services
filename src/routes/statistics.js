import express from 'express';
const StatisticsRoutes = express.Router();
import controllers from '../controllers/_index.js';

StatisticsRoutes.get(
    '/qtdFlow/:idFlow',
    controllers.statisticsController.getProcessByStepInFlow,
);

export default StatisticsRoutes;