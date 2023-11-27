import ProcessAudService from './processAudService.js';
import models from '../models/_index.js';
import { Op } from 'sequelize';
import FlowStageService from './flowStage.js';
import sequelizeConfig from '../config/sequelize.js';

class ProcessService {
  constructor(ProcessModel) {
    this.process = ProcessModel;
    this.processAud = new ProcessAudService(models.ProcessAud);
    this.flowStageService = new FlowStageService(models.FlowStage);
    this.noteRepository = models.Note;
    this.processesFileItemRepository = models.ProcessesFileItem;
  }

  async createProcessAndAud(process, req) {
    const createdProcess = await this.process.create(process);
    await this.processAud.create(
      createdProcess.idProcess,
      createdProcess,
      'INSERT',
      req,
    );
    return createdProcess;
  }

  async updateProcess(req, res) {
    let { nickname, priority: idPriority, idFlow, status } = req.body;

    const idProcess = req.params.idProcess;

    let originalProcess;

    try {
      originalProcess = await this.getProcessById(idProcess);
    } catch (error) {
      return res.status(500).json({ error: 'Falha ao buscar processo.' });
    }

    let startingProcess;
    let flowStages;

    if (idFlow && originalProcess.idFlow !== idFlow) {
      flowStages = await this.flowStageService.findAllByIdFlow(idFlow, 1);
      startingProcess = {
        idStage: null,
        effectiveDate: null,
        status: 'notStarted',
      };
    } else {
      flowStages = await this.flowStageService.findAllByIdFlow(
        originalProcess.idFlow,
        1,
      );
      startingProcess =
        originalProcess.status === 'notStarted' &&
        req.body.status === 'inProgress'
          ? {
              idStage: flowStages[0].idStageA || originalProcess.idStage,
              effectiveDate: new Date(),
              status: 'inProgress',
            }
          : {};
    }

    if (!flowStages.length) {
      return res.status(404).json({ error: 'Não há etapas neste fluxo' });
    }

    if (startingProcess.status) {
      status = startingProcess.status;
      delete startingProcess.status;
    }

    const newData = {
      ...(idFlow && { idFlow }),
      ...(nickname && { nickname }),
      ...(idPriority && { idPriority }),
      ...(status && { status }),
      ...startingProcess,
    };

    console.log(req.body);
    console.log(newData);
    console.log(originalProcess);

    Object.keys(newData).forEach(
      k => originalProcess[k] === newData[k] && delete newData[k],
    );

    return await this.executeUpdateQuery(idProcess, newData, req);
  }

  async executeUpdateQuery(idProcess, newData, req) {
    // newData param should receive only the modified fields
    const [updateCount, updatedEntities] = await this.process.update(newData, {
      where: { idProcess },
      returning: true,
    });
    await this.processAud.create(idProcess, newData, 'UPDATE', req);
    if (updateCount > 0) {
      return updatedEntities[0];
    } else {
      return false;
    }
  }

  async updateProcessStage(req, res) {
    const { idProcess, from, to, idFlow } = req.body;

    if (
      isNaN(parseInt(from)) ||
      isNaN(parseInt(to)) ||
      isNaN(parseInt(idFlow))
    ) {
      return res.status(400).json({
        error: 'Identificadores inválidos',
        message: `Identificadores '${idFlow}', '${from}', ou '${to}' são inválidos`,
      });
    }

    const flowStages = await this.flowStageService.findAllByIdFlow(idFlow);

    let canAdvance = false;

    if (flowStages?.length > 0) {
      for (const flowStage of flowStages) {
        if (
          (flowStage.idStageA === from && flowStage.idStageB === to) ||
          (flowStage.idStageB === from && flowStage.idStageA === to)
        ) {
          canAdvance = true;
          break;
        }
      }
    }

    if (!canAdvance) {
      return res.status(409).json({
        error: 'Transição impossível',
        message: `Não há a transição da etapa '${to}' para '${from}' no fluxo '${idFlow}'`,
      });
    }

    return this.executeUpdateQuery(
      idProcess,
      { idStage: to, effectiveDate: new Date() },
      req,
    );
  }

  async finalizeProcess(req) {
    const idProcess = req.params.idProcess;

    const updatedFields = { finalised: true, status: 'finished' };

    return await this.executeUpdateQuery(idProcess, updatedFields, req);
  }

  async archiveProcess(req) {
    const idProcess = req.params.idProcess;

    const updatedFields = {
      status: req.params.archiveFlag === 'true' ? 'archived' : 'inProgress',
    };

    return await this.executeUpdateQuery(idProcess, updatedFields, req);
  }

  async deleteProcessByRecord(record, req) {
    await this.processAud.create(record, null, 'DELETE', req);
    return await this.process.destroy({ where: { record } });
  }

  async getProcessById(idProcess, attributes) {
    return await this.process.findOne({
      where: { idProcess },
      attributes: attributes?.length ? attributes : undefined,
      raw: true,
    });
  }

  async getProcessRecordById(idProcess) {
    return (await this.getProcessById(idProcess, ['record']))?.record;
  }

  async deleteProcessById(idProcess, req) {
    let result;
    await sequelizeConfig.transaction(async transaction => {
      await this.noteRepository.destroy({ where: { idProcess }, transaction });
      await this.processesFileItemRepository.destroy({
        where: { idProcess },
        transaction,
      });
      result = await this.process.destroy({
        where: { idProcess },
        transaction,
      });
      if (result)
        await this.processAud.create(
          idProcess,
          null,
          'DELETE',
          req,
          transaction,
        );
    });
    return result;
  }

  async getAllProcess(params) {
    return await this.process.findAll({
      ...params,
      include: [
        {
          model: models.Flow,
          as: 'flowInfo',
          attributes: ['name'],
        },
        {
          model: models.Priority,
          as: 'processPriority',
          attributes: ['description'],
          required: false,
        },
      ],
      order: params.sortBy
        ? params.sortBy
        : [
            ['idProcess', 'DESC'],
            ['createdAt', 'DESC'],
          ],
      raw: true,
    });
  }
  async deleteByIdFlow(idFlow) {
    return await this.process.destroy({ where: { idFlow } });
  }

  async getAndCountAllProcess(where) {
    return await this.process.findAndCountAll(where);
  }

  async getPriorityProcess() {
    return await this.process.findAll({
      where: {
        idPriority: {
          [Op.ne]: null,
        },
      },
    });
  }

  async getProcessByUniqueKeys(record, idFlow) {
    return await this.process.findOne({
      where: { record, idFlow },
    });
  }

  async getProcessByRecord(record) {
    return await this.process.findOne({
      where: { record },
    });
  }

  async getProcessByIdFlow(idFlow) {
    return await this.process.findAll({ where: { idFlow } });
  }

  validateRecord(record) {
    const filteredRecord = record.replace(/[^\d]/g, '');
    const regexFilter = /^\d{20}$/;
    const isRecordValid = regexFilter.test(filteredRecord);

    return {
      filteredRecord,
      valid: isRecordValid,
    };
  }

  async countRows({ where }) {
    return this.process.count({ where });
  }
}

export default ProcessService;
