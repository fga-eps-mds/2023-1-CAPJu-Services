import express from 'express';
import controllers from '../controllers/_index.js';

const FlowUserRoutes = express.Router();

FlowUserRoutes.get('/', controllers.flowUserController.index);

export default FlowUserRoutes;
