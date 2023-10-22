import express from 'express';
import controllers from '../controllers/_index.js';

const StatisticsRoutes = express.Router();

StatisticsRoutes.get('/:minDate/:maxDate',controllers.statisticsController.getProcessByDueDateInFlow);

export default StatisticsRoutes;