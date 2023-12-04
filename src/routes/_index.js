import express from 'express';
import UserRoutes from './user.js';
import UserAccessLogRoutes from "./userAccessLog.js";

const applicationRoutes = express.Router();

applicationRoutes.use('/', UserRoutes);
applicationRoutes.use('/sessions', UserAccessLogRoutes);

export default applicationRoutes;
