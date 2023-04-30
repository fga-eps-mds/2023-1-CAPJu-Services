import express from "express";
import UserService from "../services/user.js";
import models from "../models/index.js";

const UserRoutes = express.Router()
const userService = new UserService(models.User)

UserRoutes.get("/", async (req, res, next) => {
  try {
    console.log(`UserRoutes - Get All Users`);
    const users = await userService.getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    console.log(`UserRoutes - ERROR: ${error}`)
    next(error);
  }
})

export default UserRoutes;
