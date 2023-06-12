import express from 'express';
import controllers from '../controllers/_index.js';

const FlowStageRoutes = express.Router();

FlowStageRoutes.get('/', controllers.flowStageController.index);
FlowStageRoutes.delete(
  '/flow/:idFlow/:idStageA/:idStageB',
  controllers.flowStageController.delete,
);
export default FlowStageRoutes;
