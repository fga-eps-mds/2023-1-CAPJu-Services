import { FlowController } from './flow.js';
import { FlowStageController } from './flowStage.js';
import { FlowUserController } from './flowUser.js';
import { PriorityController } from './priority.js';
import { ProcessController } from './process.js';
import { StageController } from './stage.js';
import { StatisticsController } from './statistics.js';

const priorityController = new PriorityController();
const flowController = new FlowController();
const flowStageController = new FlowStageController();
const flowUserController = new FlowUserController();
const processController = new ProcessController();
const stageController = new StageController();
const statisticsController = new StatisticsController();

const controllers = {
  priorityController,
  flowController,
  flowStageController,
  flowUserController,
  processController,
  stageController,
  statisticsController,
};

export default controllers;
