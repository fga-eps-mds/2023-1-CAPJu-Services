import express from 'express';
import controllers from '../controllers/_index.js';
const DocumentAudRoutes = express.Router();
const controller = controllers.documentAudController;

DocumentAudRoutes.post('/registerEvent', controller.registerEvent);

export default DocumentAudRoutes;
