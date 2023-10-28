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

StatisticsRoutes.get(
  '/AllProcessByStage/:idFlow/:idStage',
  controllers.statisticsController.getAllProcessByStepInStage,
);

StatisticsRoutes.get(
  '/:minDate/:maxDate',
  controllers.statisticsController.getProcessByDueDateInFlow,
);

export default StatisticsRoutes;
