import express from 'express';
import NoteRoutes from './note.js';

const applicationRoutes = express.Router();

applicationRoutes.use('/notes', NoteRoutes);

export default applicationRoutes;
