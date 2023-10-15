import express from 'express';
import controllers from '../controllers/_index.js';
import {authenticate} from '../../middleware/authMiddleware.js';
const ProcessAudRoutes = express.Router();
const controller = controllers.processAudController;

ProcessAudRoutes.get('/findAllPaged', authenticate, controller.findAllPaged);
ProcessAudRoutes.get('/findAll', authenticate, controller.findAll);

export default ProcessAudRoutes;
