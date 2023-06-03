import express from 'express';
import controllers from '../controllers/_index.js';

const StageRoutes = express.Router();

StageRoutes.get('/', controllers.stageController.getAllStages);

export default StageRoutes;
