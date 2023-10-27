import PriorityModel from './priority.js';
import FlowModel from './flow.js';
import StageModel from './stage.js';
import FlowStageModel from './flowStage.js';
import ProcessModel from './process.js';
import FlowUserModel from './flowUser.js';
import ProcessAudModel from './processAud.js';
import UserModel from './User.js';
import Unit from './Unit.js';
import RoleModel from './Role.js';
import UnitModel from './unit.js';
import NoteModel from './note.js';
import ProcessesFileModel from './processesFile.js';
import ProcessesFileItemModel from './processesFileItem.js';
import DocumentAudModel from './documentAud.js';

const Priority = PriorityModel;
const Flow = FlowModel;
const Stage = StageModel;
const FlowStage = FlowStageModel;
const Process = ProcessModel;
const ProcessAud = ProcessAudModel;
const FlowUser = FlowUserModel;
const User = UserModel;
const Role = RoleModel;
const Note = NoteModel;
const ProcessesFile = ProcessesFileModel;
const ProcessesFileItem = ProcessesFileItemModel;
const DocumentAud = DocumentAudModel;

const models = {
  Priority,
  Flow,
  Stage,
  FlowStage,
  Unit,
  Process,
  Role,
  User,
  FlowUser,
  ProcessAud,
  UnitModel,
  Note,
  ProcessesFile,
  ProcessesFileItem,
  DocumentAud,
};

User.associate(models);
ProcessAud.associate(models);
Process.associate(models);
ProcessesFile.associate(models);
ProcessesFileItem.associate(models);
DocumentAud.associate(models);

export default models;
