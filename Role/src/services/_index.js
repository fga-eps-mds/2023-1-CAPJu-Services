import models from '../models/_index.js';
import RoleService from './role.js';

const roleService = new RoleService(models.Role);
const services = {
  roleService,
};

export default services;
