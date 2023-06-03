import express from 'express';
import { FlowStageController } from '../controllers/flowStage.js';

const FlowStageRoutes = express.Router();
const flowStageController = new FlowStageController();

FlowStageRoutes.get('/', flowStageController.getAllFlowsStages);

export default FlowStageRoutes;
