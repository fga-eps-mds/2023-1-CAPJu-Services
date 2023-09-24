import express from 'express';
import controllers from '../controllers/_index.js';

const FlowRoutes = express.Router();
FlowRoutes.get('/', controllers.flowController.index);
FlowRoutes.get(
  '/process/:record',
  controllers.flowController.showByProcessRecord,
);
FlowRoutes.get('/:idFlow', controllers.flowController.showByFlowId);
FlowRoutes.get(
  '/flowSequences/:idFlow',
  controllers.flowController.showByFlowIdWithSequence,
);
FlowRoutes.get(
  '/:idFlow/usersToNotify',
  controllers.flowController.showUsersToNotify,
);
FlowRoutes.post('/newFlow', controllers.flowController.store);
FlowRoutes.put('/', controllers.flowController.update);
FlowRoutes.delete('/:idFlow', controllers.flowController.delete);

export default FlowRoutes;
