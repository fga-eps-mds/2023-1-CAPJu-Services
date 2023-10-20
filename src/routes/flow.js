import express from 'express';
import controllers from '../controllers/_index.js';
import {authenticate, authorize} from '../../middleware/authMiddleware.js';

const FlowRoutes = express.Router();
FlowRoutes.get('/', authenticate, authorize('see-flow'), controllers.flowController.index);
FlowRoutes.post('/newFlow', authenticate, authorize('create-flow'), controllers.flowController.store);
FlowRoutes.put('/', authenticate, authorize('edit-flow'), controllers.flowController.update);
FlowRoutes.delete('/:idFlow', authenticate, authorize('delete-flow'), controllers.flowController.delete);
FlowRoutes.get('/process/:record', authenticate, controllers.flowController.showByProcessRecord);
FlowRoutes.get('/:idFlow', authenticate, controllers.flowController.showByFlowId);
FlowRoutes.get('/flowSequences/:idFlow', authenticate, controllers.flowController.showByFlowIdWithSequence);
FlowRoutes.get('/:idFlow/usersToNotify', authenticate, controllers.flowController.showUsersToNotify);

export default FlowRoutes;
