import express from 'express';
import controllers from '../controllers/_index.js';
import {authenticate} from '../../middleware/authMiddleware.js';
const DocumentAudRoutes = express.Router();
const controller = controllers.documentAudController;

DocumentAudRoutes.post('/registerEvent', authenticate, controller.registerEvent);

export default DocumentAudRoutes;