import express from 'express';
import ProcessRoutes from './process.js';

const applicationRoutes = express.Router();

applicationRoutes.use('/process', ProcessRoutes);

export default applicationRoutes;
