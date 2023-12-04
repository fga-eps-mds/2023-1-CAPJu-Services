import PriorityModel from './priority.js';
import FlowModel from './flow.js';
import StageModel from './stage.js';
import FlowStageModel from './flowStage.js';
import ProcessModel from './process.js';
import FlowUserModel from './flowUser.js';
import ProcessAudModel from './processAud.js';
import UserModel from './user.js';
import RoleModel from './role.js';
import UnitModel from './unit.js';
import NoteModel from './note.js';
import ProcessesFileModel from './processesFile.js';
import ProcessesFileItemModel from './processesFileItem.js';
import DocumentAudModel from './documentAud.js';
import UserAccessLogModel from './userAccesLog.js';

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
const Unit = UnitModel;
const UserAccessLog = UserAccessLogModel;

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
  Note,
  ProcessesFile,
  ProcessesFileItem,
  DocumentAud,
  UserAccessLog,
};

User.associate(models);
ProcessAud.associate(models);
Process.associate(models);
ProcessesFile.associate(models);
ProcessesFileItem.associate(models);
DocumentAud.associate(models);

export default models;
