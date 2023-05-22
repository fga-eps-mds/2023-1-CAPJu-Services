import express from 'express';
import { UserController } from '../controllers/user.js';
const UserRoutes = express.Router();
const userController = new UserController();

UserRoutes.get('/allUser', userController.getAllUsers);
UserRoutes.get('/cpf/:cpf', userController.getUserByCpf);
UserRoutes.post('/login', userController.loginUser);
UserRoutes.post('/newUser', userController.store);
UserRoutes.post('/updateUser/:cpf', userController.updateUserEmail);
UserRoutes.post('/updateUserRole', userController.updateUserRole);
UserRoutes.post('/updateUserPassword/:cpf', userController.updateUserPassword);
UserRoutes.delete('/deleteUser/:cpf', userController.deleteByCpf);

export default UserRoutes;
