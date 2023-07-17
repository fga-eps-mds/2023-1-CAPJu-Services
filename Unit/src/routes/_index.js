import express from 'express';
import UnitRoutes from './unit.js';

const applicationRoutes = express.Router();

applicationRoutes.use('/', UnitRoutes);

export default applicationRoutes;
