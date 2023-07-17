import express from 'express';
import RoleRoutes from './role.js';

const applicationRoutes = express.Router();

applicationRoutes.use('/', RoleRoutes);

export default applicationRoutes;
