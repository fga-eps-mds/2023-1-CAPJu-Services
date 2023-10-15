import UserModel from './user.js';
import UnitModel from './unit.js';
import RoleModel from './role.js';

const User = UserModel;
const Unit = UnitModel;
const Role = RoleModel;

const models = {
  User,
  Unit,
  Role
};

Object.values(models)
    .filter(model => typeof model.associate === 'function')
    .forEach(model => model.associate(models));


export default models;
