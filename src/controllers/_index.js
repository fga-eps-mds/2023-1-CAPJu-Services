import { UserController } from './user.js';
import { UserAccessLogController } from './userAccessLog.js';

const userController = new UserController();
const userAccessLogController = new UserAccessLogController();

const controllers = {
  userController,
  userAccessLogController,
};

export default controllers;
