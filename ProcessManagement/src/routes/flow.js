import express from 'express';
import controllers from '../controllers/_index.js';

const FlowRoutes = express.Router();
FlowRoutes.get('/', controllers.flowController.index);
FlowRoutes.get(
  '/flows/process/:record',
  controllers.flowController.indexByRecord,
);
FlowRoutes.get('/flow/:idFlow', controllers.flowController.getById);

FlowRoutes.post('/newFlow', controllers.flowController.store);
FlowRoutes.delete('/flow/:idFlow', controllers.flowController.delete);

export default FlowRoutes;
