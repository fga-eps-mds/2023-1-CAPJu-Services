import 'dotenv/config';
import services from '../services/_index.js';
import {
  filterByLegalPriority,
  filterByNicknameAndRecord,
  filterByStatus,
  filterByIdFlow,
  filterByDateRange,
  filterByFlowName,
  filterByStageName,
  filterByName,
} from '../utils/filters.js';
import { tokenToUser } from '../../middleware/authMiddleware.js';

export class ProcessController {
  constructor() {
    this.processService = services.processService;
    this.priorityService = services.priorityService;
    this.flowStageService = services.flowStageService;
    this.flowService = services.flowService;
    this.stageService = services.stageService;
  }

  index = async (req, res) => {
    try {
      let where;
      let stagesForFilter = {};
      const { idRole, idUnit } = await tokenToUser(req);

      if (req.query.filter?.type === 'stage') {
        const name = req.query.filter.value;
        where = {
          ...filterByName({ query: { filter: name } })
        };
        const stages = await this.stageService.findAll({where});

        stagesForFilter = stages.map((stage) => {
          if (stage.name.includes(name))
            return { idStage: stage.idStage }
        });
      }

      const unitFilter = idRole === 5 ? {} : { idUnit };

      where = {
        ...filterByStatus(req),
        ...filterByLegalPriority(req),
        ...filterByNicknameAndRecord(req),
        ...filterByFlowName(req),
        ...filterByStageName(req, stagesForFilter),
        ...filterByIdFlow(req),
        ...filterByDateRange(req),
        ...unitFilter,
      };
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || null;

      console.log(where)
      console.log(filterByStatus(req));

      const processes = await this.processService.getAllProcess({
        where,
        limit,
        offset,
      });

      if (!processes || processes.length === 0) {
        return res.status(204).json([]);
      }
      const totalCount = await this.processService.countRows({ where });
      const totalPages = Math.ceil(totalCount / limit) || 0;

      return res.status(200).json({ processes, totalPages });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
        message: 'Erro ao buscar processos',
      });
    }
  };

  getProcessByRecord = async (req, res) => {
    const { record } = req.params;
    try {
      const process = await this.processService.getProcessByRecord(record);
      if (!process) {
        return res.status(404).json({
          error: 'Esse processo não existe!',
          message: 'Esse processo não existe!',
        });
      } else {
        return res.status(200).json(process);
      }
    } catch (error) {
      return res.status(500).json({
        error: `${error}`,
        message: `Erro ao procurar processo`,
      });
    }
  };

  getProcessByIdFlow = async (req, res) => {
    const idFlow = req.params.idFlow;
    try {
      const process = await this.processService.getProcessByIdFlow(idFlow);
      if (!process) {
        return res.status(404).json({
          error: 'Processos não encontrados nesse fluxo!',
          message: 'Processos não encontrados nesse fluxo!',
        });
      } else {
        return res.status(200).json(process);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: `Erro ao procurar processo.`,
      });
    }
  };

  getProcessByUniqueKeys = async (req, res) => {
    const { record, idFlow } = req.params;
    try {
      const process = await this.processService.getProcessByUniqueKeys(
        record,
        idFlow,
      );
      if (!process) {
        return res.status(404).json({
          error: 'Esse processo não existe nesse fluxo!',
          message: 'Esse processo não existe nesse fluxo!',
        });
      } else {
        return res.status(200).json(process);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: `Erro ao procurar processo nesse fluxo`,
      });
    }
  };

  store = async (req, res) => {
    try {
      let { record, nickname, priority, idFlow } = req.body;
      let idPriority = priority;

      const recordStatus = this.processService.validateRecord(record);

      if (!recordStatus.valid) {
        return res.status(400).json({
          error: 'Registro fora do padrão CNJ',
          message: `Registro '${req.body?.record}' está fora do padrão CNJ`,
        });
      }

      record = recordStatus.filteredRecord;
      let flow;

      try {
        flow = await this.flowService.findOneByFlowId(idFlow);
      } catch (error) {
        return res.status(500).json({
          error: `${error}`,
          message: 'Erro ao buscar fluxo por idFlow.',
        });
      }

      try {
        if (flow) {
          await this.processService.createProcess({
            record,
            idUnit: flow.idUnit,
            nickname,
            idFlow,
            idPriority,
            finalised: false,
          });

          return res.status(200).json({
            message: `Processo criado com sucesso.`,
          });
        }
      } catch (error) {
        return res.status(500).json({
          error: `${error}`,
          message: `Erro ao criar processo.`,
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: `${error}`,
        message: `Erro ao criar processo.`,
      });
    }
  };

  getPriorityProcess = async (req, res) => {
    try {
      const priorityProcesses = await this.processService.getPriorityProcess();

      if (!priorityProcesses) {
        return res
          .status(404)
          .json({ error: 'Não há processos com prioridade legal.' });
      } else {
        return res.status(200).json(priorityProcesses);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  updateProcess = async (req, res) => {
    try {
      const { nickname, status } = req.body;

      const recordStatus = this.processService.validateRecord(
        req.params.record,
      );

      if (!recordStatus.valid) {
        return res.status(400).json({
          error: 'Registro fora do padrão CNJ',
          message: `Registro '${req.params.record}' está fora do padrão CNJ`,
        });
      }

      let record = recordStatus.filteredRecord;
      let process;

      try {
        process = await this.processService.getProcessByRecord(record);
      } catch (error) {
        return res.status(500).json({ error: 'Falha ao buscar processo.' });
      }

      const flowStages = await this.flowStageService.findAllByIdFlow(
        process.idFlow,
      );
      if (flowStages.length === 0) {
        return res.status(404).json({ error: 'Não há etapas neste fluxo' });
      }

      const startingProcess =
        process.status === 'notStarted' && req.body.status === 'inProgress'
          ? {
              idStage: flowStages[0].idStageA || process.idStage,
              effectiveDate: new Date(),
              status: 'inProgress',
            }
          : {
              idStage: flowStages[0].idStageA || process.idStage,
              effectiveDate: new Date(),
              status,
            };

      const updatedProcess = await this.processService.updateProcess(
        {
          nickname,
          ...startingProcess,
        },
        process.record,
      );

      if (updatedProcess) {
        return res.status(200).json(updatedProcess);
      }
      return res
        .status(500)
        .json({ message: 'Não foi possível atualizar o processo.' });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  deleteProcess = async (req, res) => {
    try {
      const result = await this.processService.deleteProcessByRecord(
        req.params.record,
      );

      if (result === 0) {
        return res
          .status(404)
          .json({ error: `Não há registro ${req.params.record}.` });
      }

      return res.status(200).json({ message: 'Processo apagado.' });
    } catch (error) {
      return res
        .status(500)
        .json({ error, message: 'Erro ao apagar processo.' });
    }
  };

  updateProcessStage = async (req, res) => {
    const { record, from, to, idFlow } = req.body;

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

    try {
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
      const result = await this.processService.updateProcess(
        {
          idStage: to,
          effectiveDate: new Date(),
        },
        record,
      );
      if (result) {
        return res.status(200).json({
          message: 'Etapa atualizada com sucesso.',
        });
      }

      return res.status(400).json({ message: 'Erro ao atualizar processo.' });
    } catch (error) {
      return res.status(500).json({
        error: `${error}`,
        message: `Erro ao atualizar processo '${record}' para etapa '${to}`,
      });
    }
  };
}
