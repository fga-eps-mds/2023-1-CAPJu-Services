import express from 'express';
import controllers from '../controllers/_index.js';

const RoleRoutes = express.Router();

RoleRoutes.post('/newRole', controllers.roleController.store);
RoleRoutes.get('/', controllers.roleController.index);
RoleRoutes.get('/roleAdmins/:idRole', controllers.roleController.getById);
RoleRoutes.put('/updateRole/:idRole', controllers.roleController.updateRole);
RoleRoutes.delete('/deleteRole', controllers.roleController.delete);

export default RoleRoutes;
