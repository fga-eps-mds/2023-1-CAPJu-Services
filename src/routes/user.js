import express from 'express';
import controllers from '../controllers/_index.js';
const UserRoutes = express.Router();

UserRoutes.post('/login', controllers.userController.loginUser);
UserRoutes.post(
  '/logout/:logoutInitiator',
  controllers.userController.logoutUser,
);
UserRoutes.post(
  '/logoutExpiredSession',
  controllers.userController.logoutExpiredSession,
);
UserRoutes.patch(
  '/logoutAsAdmin/:sessionId',
  controllers.userController.logoutAsAdmin,
);
UserRoutes.get(
  '/sessionStatus/:sessionId',
  controllers.userController.getSessionStatus,
);
UserRoutes.post('/newUser', controllers.userController.store);
UserRoutes.put(
  '/updateUserPassword/:cpf',
  controllers.userController.updateUserPassword,
);
UserRoutes.get('/allUser', controllers.userController.index);
UserRoutes.get(
  '/admins/unit/:idUnit',
  controllers.userController.indexUsersAdminByUnitId,
);
UserRoutes.get('/cpf/:cpf', controllers.userController.showUserByCpf);
UserRoutes.get('/:cpf/unit/:idUnit', controllers.userController.showUserByUnit);
UserRoutes.post(
  '/acceptRequest/:cpf',
  controllers.userController.acceptRequest,
);
UserRoutes.put(
  '/updateUserFullName/:cpf',
  controllers.userController.updateUserFullName,
);
UserRoutes.put('/updateUserRole', controllers.userController.updateUserRole);
UserRoutes.put('/updateUser/:cpf', controllers.userController.updateUserEmail);
UserRoutes.delete('/deleteUser/:cpf', controllers.userController.deleteByCpf);
UserRoutes.delete(
  '/deleteRequest/:cpf',
  controllers.userController.deleteRequest,
);

export default UserRoutes;
