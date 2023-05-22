import express from 'express';
import { UserController } from '../controllers/user.js';
const UserRoutes = express.Router();
const userController = new UserController();

UserRoutes.get('/allUser', userController.getAllUsers);
UserRoutes.get('/cpf/:cpf', userController.getUserByCpf);

export default UserRoutes;
