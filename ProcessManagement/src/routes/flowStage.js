import express from 'express';
import controllers from '../controllers/_index.js';

const FlowStageRoutes = express.Router();

FlowStageRoutes.get('/', controllers.flowStageController.getFlowStages);
FlowStageRoutes.delete(
  '/flow/:idFlow/:idStageA/:idStageB',
  controllers.flowStageController.deleteFlowStage,
);
export default FlowStageRoutes;
