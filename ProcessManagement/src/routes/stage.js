import express from 'express';
import { StageController } from '../controllers/stage.js';

const StageRoutes = express.Router();
const stageController = new StageController();

StageRoutes.get('/', stageController.getAllStages);

export default StageRoutes;
