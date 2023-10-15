import { FlowController } from './flow.js';
import { FlowStageController } from './flowStage.js';
import { FlowUserController } from './flowUser.js';
import { PriorityController } from './priority.js';
import { ProcessController } from './process.js';
import { StageController } from './stage.js';
import {ProcessAudController} from './processAud.js';
import {ProcessesFileController} from './processesFile.js';

const priorityController = new PriorityController();
const flowController = new FlowController();
const flowStageController = new FlowStageController();
const flowUserController = new FlowUserController();
const processController = new ProcessController();
const processAudController = new ProcessAudController();
const stageController = new StageController();
const processesFileController = new ProcessesFileController();

const controllers = {
  priorityController,
  flowController,
  flowStageController,
  flowUserController,
  processController,
  processAudController,
  stageController,
  processesFileController,
};

export default controllers;
