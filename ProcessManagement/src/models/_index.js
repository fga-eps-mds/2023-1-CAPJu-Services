import { Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';
import PriorityModel from './priority.js';
import FlowModel from './flow.js';
import StageModel from './stage.js';
import FlowStageModel from './flowStage.js';
import ProcessModel from './process.js';
import FlowUserModel from './flowUser.js';

const Priority = PriorityModel;
const Flow = FlowModel;
const Stage = StageModel;
const FlowStage = FlowStageModel;
const Process = ProcessModel;
const FlowUser = FlowUserModel;

const models = {
  Priority,
  Flow,
  Stage,
  FlowStage,
  Process,
  FlowUser,
};

export default models;
