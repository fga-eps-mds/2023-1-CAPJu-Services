import express from 'express';
import RoleRoutes from './role.js';

const applicationRoutes = express.Router();

applicationRoutes.use('/roles', RoleRoutes);

export default applicationRoutes;
