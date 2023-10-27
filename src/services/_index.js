import models from '../models/_index.js';
import FlowService from './flow.js';
import PriorityService from './priority.js';
import FlowStageService from './flowStage.js';
import FlowUserService from './flowUser.js';
import ProcessService from './process.js';
import StageService from './stage.js';
import ProcessAudService from './processAudService.js';
import { UnitService } from './unit.js';
import { ProcessesFileService } from './processesFile.js';

const flowService = new FlowService(models.Flow);
const priorityService = new PriorityService(models.Priority);
const flowStageService = new FlowStageService(models.FlowStage);
const flowUserService = new FlowUserService(models.FlowUser);
const processService = new ProcessService(models.Process);
const processAudService = new ProcessAudService(models.ProcessAud);
const stageService = new StageService(models.Stage);
const unitService = new UnitService(models.Unit);
const processesFileService = new ProcessesFileService(models.ProcessesFile);

const services = {
  flowService,
  priorityService,
  flowStageService,
  flowUserService,
  processService,
  processAudService,
  stageService,
  unitService,
  processesFileService,
};

export default services;
