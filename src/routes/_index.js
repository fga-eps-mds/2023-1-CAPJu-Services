import express from 'express';
import PriorityRoutes from './priority.js';
import FlowRoutes from './flow.js';
import StageRoutes from './stage.js';
import FlowStageRoutes from './flowStage.js';
import ProcessRoutes from './process.js';
import FlowUserRoutes from './flowUser.js';
import StatisticsRoutes from './statistics.js';
import ProcessAudRoutes from './processAud.js';
import ProcessesFileRoutes from './processesFile.js';
import DocumentAudRoutes from './documentAud.js';

const applicationRoutes = express.Router();

const routes = [
    { path: '/priority', handler: PriorityRoutes },
    { path: '/flow', handler: FlowRoutes },
    { path: '/stage', handler: StageRoutes },
    { path: '/flowStage', handler: FlowStageRoutes },
    { path: '/process', handler: ProcessRoutes },
    { path: '/processAud', handler: ProcessAudRoutes },
    { path: '/documentAud', handler: DocumentAudRoutes },
    { path: '/processesFile', handler: ProcessesFileRoutes },
    { path: '/flowUser', handler: FlowUserRoutes },
    { path: '/statistics', handler: StatisticsRoutes }
];

routes.forEach(route => applicationRoutes.use(route.path, route.handler));

export default applicationRoutes;
