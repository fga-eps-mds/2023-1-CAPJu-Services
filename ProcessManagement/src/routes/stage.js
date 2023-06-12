import express from 'express';
import controllers from '../controllers/_index.js';

const StageRoutes = express.Router();

StageRoutes.get('/', controllers.stageController.index);
StageRoutes.get(
  '/stage/:idStage',
  controllers.stageController.showStageByStageId,
);
StageRoutes.post('/newStage', controllers.stageController.store);
StageRoutes.delete('/deleteStage/:idStage', controllers.stageController.delete);

export default StageRoutes;
