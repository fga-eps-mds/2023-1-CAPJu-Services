import express from 'express';
import controllers from '../controllers/_index.js';
const ProcessAudRoutes = express.Router();
const controller = controllers.processAudController;

ProcessAudRoutes.get('/findAll', controller.findAll);
ProcessAudRoutes.get('/findAllPaged', controller.findAllPaged);
ProcessAudRoutes.get('/generateXlsx/:idProcess', controller.generateXlsx);

export default ProcessAudRoutes;
