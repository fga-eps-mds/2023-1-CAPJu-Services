import express from 'express';
import controllers from '../controllers/_index.js';
const ProcessRoutes = express.Router();

ProcessRoutes.get('/', controllers.processController.getAllProcess);

export default ProcessRoutes;
