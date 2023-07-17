import express from 'express';
import UserRoutes from './user.js';

const applicationRoutes = express.Router();

applicationRoutes.use('/', UserRoutes);

export default applicationRoutes;
