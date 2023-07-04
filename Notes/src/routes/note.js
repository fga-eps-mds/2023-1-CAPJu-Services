import express from 'express';
import controllers from '../controllers/_index.js';

const NoteRoutes = express.Router();

NoteRoutes.get('/:record', controllers.noteController.index);
NoteRoutes.post('/newNote', controllers.noteController.newNote);
NoteRoutes.put('/updateNote/:idNote', controllers.noteController.update);
NoteRoutes.delete('/deleteNote/:idNote', controllers.noteController.delete);

export default NoteRoutes;
