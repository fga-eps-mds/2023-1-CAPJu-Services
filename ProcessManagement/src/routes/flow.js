import express from 'express';
import { FlowController } from '../controllers/flow.js';

const FlowRoutes = express.Router();
const flowController = new FlowController();

FlowRoutes.get('/', flowController.getAllFlows);

export default FlowRoutes;
