import express from 'express';
import controllers from '../controllers/_index.js';

const FlowRoutes = express.Router();
FlowRoutes.get('/', controllers.flowController.getAllFlows);

export default FlowRoutes;
