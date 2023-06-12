import express from 'express';
import controllers from '../controllers/_index.js';

const PriorityRoutes = express.Router();

PriorityRoutes.get('/', controllers.priorityController.index);

export default PriorityRoutes;
