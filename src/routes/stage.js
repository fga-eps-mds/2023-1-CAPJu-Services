import express from 'express';
import controllers from '../controllers/_index.js';
import {authenticate} from "../../middleware/authMiddleware.js";

const StageRoutes = express.Router();

StageRoutes.get('/', authenticate, controllers.stageController.index);
StageRoutes.get('/stage/:idStage', authenticate, controllers.stageController.showStageByStageId);
StageRoutes.post('/newStage', authenticate, controllers.stageController.store);
StageRoutes.delete('/deleteStage/:idStage', authenticate, controllers.stageController.delete);
StageRoutes.put('/updateStage', authenticate, controllers.stageController.update);

export default StageRoutes;
