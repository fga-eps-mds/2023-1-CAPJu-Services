import express from 'express';
import PriorityRoutes from './priority.js';
import FlowRoutes from './flow.js';
import ProcessRoutes from './process.js';


const applicationRoutes = express.Router();

applicationRoutes.use('/priority', PriorityRoutes);
applicationRoutes.use('/flow', FlowRoutes);
applicationRoutes.use('/process', ProcessRoutes);


export default applicationRoutes;
