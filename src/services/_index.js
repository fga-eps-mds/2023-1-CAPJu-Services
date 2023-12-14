import models from '../models/_index.js';
import UserService from './user.js';
import UserAccessLogService from './userAccessLog.js';

const userService = new UserService(models.User);
const userAccessLogService = new UserAccessLogService(models.UserAccessLog);

const services = {
  userService,
  userAccessLogService,
};

export default services;
