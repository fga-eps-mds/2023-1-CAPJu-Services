import express from 'express';
import { PriorityController } from '../controllers/priority.js';

const PriorityRoutes = express.Router();
const priorityController = new PriorityController();

PriorityRoutes.get('/', priorityController.getAllPriorities);

export default PriorityRoutes;
