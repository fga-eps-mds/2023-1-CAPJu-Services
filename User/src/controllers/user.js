import models from "../models/index.js";
import UserService from "../services/user.js";

export class UserController {

  constructor() {
    this.userService = new UserService(models.User)
  }

  getAllUsers = async (req, res, next) => {
    try {
      const users = await this.userService.getAllUsers()
      res.status(200).json(users)
    } catch (error) {
      next(error);
    }
  }
}

