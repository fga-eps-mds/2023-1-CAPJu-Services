import express from 'express';
import controllers from '../controllers/_index.js';
import {authenticate} from '../../middleware/authMiddleware.js';
const ProcessAudRoutes = express.Router();
const controller = controllers.processAudController;

ProcessAudRoutes.get('/findAll', authenticate, controller.findAll);
ProcessAudRoutes.get('/findAllPaged', authenticate, controller.findAllPaged);
ProcessAudRoutes.get('/generateXlsx/:idProcess', authenticate, controller.generateXlsx);

export default ProcessAudRoutes;
