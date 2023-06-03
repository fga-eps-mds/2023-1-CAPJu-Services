import express from 'express';
import PriorityRoutes from './priority.js';
import FlowRoutes from './flow.js';
import StageRoutes from './stage.js';
import FlowStageRoutes from './flowStage.js';
import ProcessRoutes from './process.js';
import FlowUserRoutes from './flowUser.js';

const applicationRoutes = express.Router();

applicationRoutes.use('/priority', PriorityRoutes);
applicationRoutes.use('/flow', FlowRoutes);
applicationRoutes.use('/stage', StageRoutes);
applicationRoutes.use('/flowStage', FlowStageRoutes);
applicationRoutes.use('/process', ProcessRoutes);
applicationRoutes.use('/flowUser', FlowUserRoutes);

export default applicationRoutes;
