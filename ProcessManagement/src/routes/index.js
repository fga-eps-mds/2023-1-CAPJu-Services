import express from 'express';
import ProcessRoutes from './process.js';
import PriorityRoutes from './priority.js';

const applicationRoutes = express.Router();

applicationRoutes.use('/process', ProcessRoutes);
applicationRoutes.use('/priority', PriorityRoutes);

export default applicationRoutes;
