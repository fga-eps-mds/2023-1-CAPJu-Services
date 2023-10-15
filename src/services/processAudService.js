import {userFromReq} from '../../middleware/authMiddleware.js';
import models from '../models/_index.js';
import FlowService from './flow.js';
import {UnitService} from './unit.js';
import PriorityService from './priority.js';
import StageService from './stage.js';
import ProcessService from "./process.js";

class ProcessAudService {

  constructor(ProcessAudModel) {
    this.processAudRepository = ProcessAudModel;
    this.flowService = new FlowService(models.Flow);
    this.unitService = new UnitService(models.Unit);
    this.priorityService = new PriorityService(models.Priority);
    this.stageService = new StageService(models.Stage);
  }

  async create(idProcess, newValues, operation, req) {

    // For memory and logic purposes, the "newValues" param should only receive the fields that changed.

    const processRecord = await (new ProcessService(models.Process)).getProcessRecordById(idProcess);

    const auditEntry = {
      idProcess,
      processRecord,
      operation,
      changedBy: (await userFromReq(req)).cpf,
      oldValues: null,
      newValues: newValues ? JSON.stringify(newValues) : null,
      changedAt: new Date(),
      remarks: null,
    };

    return await this.processAudRepository.create(auditEntry)

  }

  async findAllPaged(req) {

    const {offset = 0, limit = 10} = req.query;

    const where = await this.extractFiltersFromReq(req);

    let auditRecords = await this.processAudRepository.findAll({
      where,
      include: [{model: models.User, as: 'userInfo', attributes: ['fullName'], required: false}],
      offset: offset,
      limit: limit,
      order: [['id', 'DESC']], // <- IF THIS CHANGES, THE LOGIC BELLOW SHOULD ALSO CHANGE.
    });

    const totalCount = await this.processAudRepository.count({ where });
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    const data = await this.extractProcessEventsFromAuds(auditRecords);

    return {
      data: data,
      pagination: {
        totalRecords: totalCount,
        totalPages: totalPages,
        currentPage: currentPage,
        perPage: limit,
      }
    };
  }

  async findAll(req) {

    let auditRecords = await this.processAudRepository.findAll({
      where: await this.extractFiltersFromReq(req),
      include: [{model: models.User, as: 'userInfo', attributes: ['fullName'], required: false}],
      order: [['id', 'DESC']], // <- IF THIS CHANGES, THE LOGIC BELLOW SHOULD ALSO CHANGE.
    });

    return await this.extractProcessEventsFromAuds(auditRecords);
  }

  async extractFiltersFromReq(req) {
    const filter = {};
    const { idProcess } = req.query;
    if (idProcess)
      filter.idProcess = idProcess;
    return filter;
  }

  findEntityByID = (entities, idName, idToBeFound) => {
    return entities.find(e => e[idName] === Number(idToBeFound));
  }

  getStatusPt = (status) => {

    const statuses = {
      inProgress: 'em progresso',
      archived: 'arquivado',
      finished: 'finalizado',
      notStarted: 'não iniciado',
    };

    return statuses[status];
  }

  async extractProcessEventsFromAuds(auditRecords) {

    if(!auditRecords?.length)
      return [];

    const entityConfig = {
      'idUnit': {service: this.unitService, attributes: ['idUnit', 'name']},
      'idFlow': {service: this.flowService, attributes: ['idFlow', 'name']},
      'idPriority': {service: this.priorityService, attributes: ['idPriority', 'description']},
      'idStage': {service: this.stageService, attributes: ['idStage', 'name']},
    };

    const entities = Object.keys(entityConfig).map(key => ({key, ids: [], values: []}));

    auditRecords = auditRecords.map(processAud => {
      processAud = processAud.toJSON();
      entities.forEach(entity => {
        const value = JSON.parse(processAud.newValues || '{}')[entity.key];
        if (typeof value === 'number' && !entity.ids.includes(value)) {
          entity.ids.push(Number(value));
        }
      });
      return processAud;
    });

    for (const entity of entities) {
      if (entity.ids.length) {
        const {service, attributes} = entityConfig[entity.key];
        entity.values = (await service.findAll({[entity.key]: entity.ids}, attributes)).map(r => r.toJSON());
      }
    }

    const operationMessages = {
      INSERT: () => ['Processo criado'],
      DELETE: () => ['Processo deletado'],
      NOTE_CHANGE: (aud) => [aud.remarks],
      UPDATE: aud => {
        const newValues = JSON.parse(aud.newValues);
        return {
          nickname: newValues.nickname ? `Apelido alterado para ${newValues.nickname}` : null,
          idStage: newValues.idStage ? `Etapa alterada para ${this.findEntityByID(entities.find(e => e.key === 'idStage').values, 'idStage', newValues.idStage).name}` : null,
          idFlow: newValues.idFlow ? `Fluxo alterado para ${this.findEntityByID(entities.find(e => e.key === 'idFlow').values, 'idFlow', newValues.idFlow).name}` : null,
          idPriority: newValues.idPriority ? `Prioridade alterada para ${this.findEntityByID(entities.find(e => e.key === 'idPriority').values, 'idPriority', newValues.idPriority).description}` : null,
          idUnit: newValues.idUnit ? `Unidade alterada para ${this.findEntityByID(entities.find(e => e.key === 'idUnit').values, 'idUnit', newValues.idUnit).name}` : null,
          status: newValues.status ? `Status alterado para ${this.getStatusPt(newValues.status)}` : null
        };
      },
    };

    const events = [];

    for (const processAud of auditRecords) {

      let messages;

      const messagesObj = operationMessages[processAud.operation](processAud);
      messages = Object.values(messagesObj).filter(Boolean);

      events.push({
        changedAt: processAud.changedAt,
        changedBy: processAud.userInfo?.fullName || processAud.changedBy,
        messages,
      });

    }

    return events;
  }

}

export default ProcessAudService;