import UserModel from './user.js';
import UnitModel from './unit.js';
import RoleModel from './role.js';
import UserAccessLogModel from './userAccesLog.js';
import UserEndpointAccessLogModel from './userEndpointAccessLog.js';
import PasswordResetModel from './passwordReset.js';

const User = UserModel;
const Unit = UnitModel;
const Role = RoleModel;
const UserAccessLog = UserAccessLogModel;
const UserEndpointAccessLog = UserEndpointAccessLogModel;
const PasswordReset = PasswordResetModel;

const models = {
  User,
  Unit,
  Role,
  UserAccessLog,
  UserEndpointAccessLog,
  PasswordReset,
};

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

export default models;
