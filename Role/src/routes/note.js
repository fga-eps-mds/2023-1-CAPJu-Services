import express from 'express';
import controllers from '../controllers/_index.js';

const RoleRoutes = express.Router();

RoleRoutes.post('/newRole', controllers.roleController.store);
RoleRoutes.get('/', controllers.roleController.index);
RoleRoutes.get('/roleAdmins/:idRole', controllers.roleController.getById);
RoleRoutes.put('/updateRole', controllers.roleController.updateRoleName);
RoleRoutes.put(
  '/updateRoleAllowedActions/:idRole',
  controllers.roleController.updateRoleAllowedActions,
);
RoleRoutes.delete('/deleteRole', controllers.roleController.delete);

export default RoleRoutes;
