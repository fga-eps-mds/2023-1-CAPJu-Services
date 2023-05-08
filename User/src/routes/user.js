import express from "express";
import { UserController } from "../controllers/user.js";
const UserRoutes = express.Router();
const userController = new UserController();

UserRoutes.get("/", userController.getAllUsers)

export default UserRoutes;
