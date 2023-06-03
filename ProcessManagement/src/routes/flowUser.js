import express from 'express';
import { FlowUserController } from '../controllers/flowUser.js';

const FlowUserRoutes = express.Router();
const flowUserController = new FlowUserController();

FlowUserRoutes.get('/', flowUserController.getAllFlowsUsers);

export default FlowUserRoutes;
