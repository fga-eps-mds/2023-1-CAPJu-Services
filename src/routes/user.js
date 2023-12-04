import express from 'express';
import controllers from '../controllers/_index.js';
import { authenticate } from '../middleware/authMiddleware.js';
const UserRoutes = express.Router();

UserRoutes.post('/login', controllers.userController.loginUser);
UserRoutes.post('/newUser', controllers.userController.store);
UserRoutes.put(
  '/updateUserPassword/:cpf',
  controllers.userController.updateUserPassword,
);
UserRoutes.get('/allUser', authenticate, controllers.userController.index);
UserRoutes.get(
  '/admins/unit/:idUnit',
  authenticate,
  controllers.userController.indexUsersAdminByUnitId,
);
UserRoutes.get(
  '/cpf/:cpf',
  authenticate,
  controllers.userController.showUserByCpf,
);
UserRoutes.get('/:cpf/unit/:idUnit', controllers.userController.showUserByUnit);
UserRoutes.post(
  '/acceptRequest/:cpf',
  authenticate,
  controllers.userController.acceptRequest,
);
UserRoutes.put(
  '/updateUser/:cpf',
  authenticate,
  controllers.userController.updateUserEmail,
);
UserRoutes.put(
  '/updateUserFullName/:cpf',
  authenticate,
  controllers.userController.updateUserFullName
);
UserRoutes.put(
  '/updateUserRole',
  authenticate,
  controllers.userController.updateUserRole,
);
UserRoutes.delete(
  '/deleteUser/:cpf',
  authenticate,
  controllers.userController.deleteByCpf,
);
UserRoutes.delete(
  '/deleteRequest/:cpf',
  authenticate,
  controllers.userController.deleteRequest,
);

export default UserRoutes;
