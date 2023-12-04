import express from 'express';
import controllers from '../controllers/_index.js';
const UserAccessLogRoutes = express.Router();

UserAccessLogRoutes.get('/findAllPaged', controllers.userAccessLogController.findAllPaged);

export default UserAccessLogRoutes;
