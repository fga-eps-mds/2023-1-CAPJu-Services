import express from 'express';
import controllers from '../controllers/_index.js';

const FlowStageRoutes = express.Router();

FlowStageRoutes.get('/', controllers.flowStageController.getAllFlowsStages);

export default FlowStageRoutes;
