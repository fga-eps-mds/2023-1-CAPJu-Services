import express from 'express';
import controllers from '../controllers/_index.js';

const FlowRoutes = express.Router();
FlowRoutes.get('/', controllers.flowController.index);
FlowRoutes.get(
  '/flows/process/:record',
  controllers.flowController.indexByRecord,
);
FlowRoutes.get('/flow/:idFlow', controllers.flowController.getById);
FlowRoutes.get(
  '/flowSequences/:idFlow',
  controllers.flowController.getByIdWithSequence,
);
FlowRoutes.get(
  '/flow/:idFlow/usersToNotify',
  controllers.flowController.getUsersToNotify,
);
FlowRoutes.post('/newFlow', controllers.flowController.store);
FlowRoutes.put('/', controllers.flowController.update);
FlowRoutes.delete('/flow/:idFlow', controllers.flowController.delete);

export default FlowRoutes;
