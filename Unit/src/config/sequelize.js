import { Sequelize } from 'sequelize';
import dbConfig from './database.js';

const sequelizeConfig = new Sequelize(dbConfig);

export default sequelizeConfig;
