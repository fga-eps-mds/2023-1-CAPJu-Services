import { Sequelize } from "sequelize";
import sequelizeConfig from '../config/sequelize.js';
import UserModel from './user.js';

const User = UserModel(sequelizeConfig, Sequelize.DataTypes)

const models = {
  User,
}

export default models;
