import express from 'express';
import controllers from '../controllers/_index.js';
import {authenticate} from "../../middleware/authMiddleware.js";

const FlowRoutes = express.Router();
FlowRoutes.get('/', controllers.flowController.index);
FlowRoutes.get('/process/:record', authenticate, controllers.flowController.showByProcessRecord);
FlowRoutes.get('/:idFlow', authenticate, controllers.flowController.showByFlowId);
FlowRoutes.get('/flowSequences/:idFlow', authenticate, controllers.flowController.showByFlowIdWithSequence);
FlowRoutes.get('/:idFlow/usersToNotify', authenticate, controllers.flowController.showUsersToNotify);
FlowRoutes.post('/newFlow', authenticate, controllers.flowController.store);
FlowRoutes.put('/', authenticate, controllers.flowController.update);
FlowRoutes.delete('/:idFlow', authenticate, controllers.flowController.delete);

export default FlowRoutes;
