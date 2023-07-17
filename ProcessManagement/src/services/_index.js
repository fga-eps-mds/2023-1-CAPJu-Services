import models from '../models/_index.js';
import FlowService from './flow.js';
import PriorityService from './priority.js';
import FlowStageService from './flowStage.js';
import FlowUserService from './flowUser.js';
import ProcessService from './process.js';
import StageService from './stage.js';

const flowService = new FlowService(models.Flow);
const priorityService = new PriorityService(models.Priority);
const flowStageService = new FlowStageService(models.FlowStage);
const flowUserService = new FlowUserService(models.FlowUser);
const processService = new ProcessService(models.Process);
const stageService = new StageService(models.Stage);

const services = {
  flowService,
  priorityService,
  flowStageService,
  flowUserService,
  processService,
  stageService,
};

export default services;
