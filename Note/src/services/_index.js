import models from '../models/_index.js';
import NoteService from './note.js';

const noteService = new NoteService(models.Note);
const services = {
  noteService: noteService,
};

export default services;
