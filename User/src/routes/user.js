import express from 'express';
import { UserController } from '../controllers/user.js';
const UserRoutes = express.Router();
const userController = new UserController();

UserRoutes.get('/', userController.index);
UserRoutes.get('/cpf/:cpf', userController.getUserByCpf);

export default UserRoutes;
