import express from 'express';
import NoteRoutes from './note.js';

const applicationRoutes = express.Router();

applicationRoutes.use('/', NoteRoutes);

export default applicationRoutes;
