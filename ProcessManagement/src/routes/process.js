import express from 'express';
import { ProcessController } from '../controllers/process.js';

const ProcessRoutes = express.Router();
const processController = new ProcessController();

ProcessRoutes.get('/', processController.getAllProcess);

export default ProcessRoutes;
