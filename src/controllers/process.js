import 'dotenv/config';
import services from '../services/_index.js';
import {
  filterByLegalPriority,
  filterByNicknameOrRecord,
  filterByNicknameAndRecord,
  filterByStatus,
  filterByIdFlow,
  filterByDateRange,
  filterByFlowName,
  filterByStageName,
  filterByName,
} from '../utils/filters.js';
import { getUserRoleAndUnitFilterFromReq } from '../../middleware/authMiddleware.js';

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
      if (req.query.filter?.type === 'stage') {
        const name = req.query.filter.value;
        where = {
          ...filterByName({ query: { filter: name } }),
        };
        const stages = await this.stageService.findAll({ where });
        stagesForFilter = stages.map(stage => {
          if (stage.name.includes(name)) return { idStage: stage.idStage };
        });
      }

      let flowsForFilter = {};
      if (req.query.filter?.type === 'flow') {
        const name = req.query.filter.value;
        where = {
          ...filterByName({ query: { filter: name } }),
        };
        const flows = await this.flowService.findAll({ where });
        flowsForFilter = flows.map(flow => {
          if (flow.name.includes(name)) return { idFlow: flow.idFlow };
        });
      }

      where = {
        ...filterByStatus(req),
        ...filterByLegalPriority(req),
        ...filterByFlowName(req, flowsForFilter),
        ...filterByStageName(req, stagesForFilter),
        ...filterByIdFlow(req),
        ...filterByDateRange(req),
        ...filterByNicknameOrRecord(req),
        ...filterByNicknameAndRecord(req),
        ...(await getUserRoleAndUnitFilterFromReq(req)),
      };

      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const processes = await this.processService.getAllProcess({
        where,
        limit,
        offset,
        attributes: [
          'idProcess',
          'idFlow',
          'idPriority',
          'record',
          'nickname',
          'status',
          'finalised',
          'idStage',
        ],
      });

      if (!processes?.length) {
        return res.status(204).json([]);
      } else {
        const processesWithFlows = [];

        const idFlows = processes.map(p => p.idFlow);

        const flowsStagesRaw = await this.flowStageService.findAll({
          idFlow: idFlows,
        });

        const flowStagesOrdered = [];

        flowsStagesRaw.forEach(flowStageRaw => {
          const flowIndex = flowStagesOrdered.findIndex(
            fS => fS.idFlow === flowStageRaw.idFlow,
          );
          if (flowIndex === -1) {
            flowStagesOrdered.push({
              idFlow: flowStageRaw.idFlow,
              stagesOrdered: [flowStageRaw.idStageA, flowStageRaw.idStageB],
            });
          } else {
            const flow = flowStagesOrdered[flowIndex];
            flow.stagesOrdered.push(flowStageRaw.idStageB);
          }
        });

        for (const process of processes) {
          const { idFlow, idStage } = process;

          let progress;

          const processFlow = flowStagesOrdered.find(
            fS => fS.idFlow === idFlow,
          );

          if (idStage !== null) {
            const currentStageCount =
              processFlow.stagesOrdered.findIndex(s => s === idStage) + 1;
            progress = `${currentStageCount}/${processFlow.stagesOrdered.length}`;
          } else {
            progress = `0/${processFlow.stagesOrdered.length}`;
          }

          processesWithFlows.push({
            ...process,
            progress,
          });
        }

        const newProcesses = await Promise.all(
          processesWithFlows.map(async process => {
            const processStage = await this.stageService.findOneByStageId(
              process.idStage,
            );

            const flow = await this.flowService.findOneByFlowId(process.idFlow);

            const flowStage = await this.flowStageService.findAllByIdFlow(
              process.idFlow,
            );

            const { stages, sequences } =
              await this.flowService.stagesSequencesFromFlowStages(flowStage);

            const flowSequence = {
              idFlow: flow.idFlow,
              name: flow.name,
              idUnit: flow.idUnit,
              stages,
              sequences,
            };

            process.flow = flowSequence;
            process.stageName = processStage?.name || 'Não iniciado';

            return process;
          }),
        );

        const totalProcesses = await this.processService.countRows({ where });
        const totalFinished = await this.processService.countRows({
          where: { ...where, status: 'finished' },
        });
        const totalArchived = await this.processService.countRows({
          where: { ...where, status: 'archived' },
        });
        const totalPages = Math.ceil(totalProcesses / limit) || 0;

        return res.status(200).json({
          processes: newProcesses,
          totalPages,
          totalProcesses,
          totalArchived,
          totalFinished,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
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

  getProcessById = async (req, res) => {
    const { idProcess } = req.params;
    try {
      const process = await this.processService.getProcessById(idProcess);
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

  getProcessesByIdFlow = async (req, res) => {
    const idFlow = req.params.idFlow;
    try {
      const process = await this.processService.getProcessesByIdFlow(idFlow);
      if (!process) {
        return res.status(404).json({
          error: 'Processos não encontrados nesse fluxo!',
          message: 'Processos não encontrados nesse fluxo!',
        });
      } else {
        return res.status(200).json(process);
      }
    } catch (error) {
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
      let {
        record: paramRecord,
        nickname,
        priority: idPriority,
        idFlow,
      } = req.body;

      let { filteredRecord: record, valid: isRecordValid } =
        this.processService.validateRecord(paramRecord);

      if (!isRecordValid) {
        return res.status(400).json({
          error: 'Registro fora do padrão CNJ',
          message: `Registro '${req.body?.record}' está fora do padrão CNJ`,
        });
      }

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
          const data = await this.processService.createProcessAndAud(
            {
              record,
              idUnit: flow.idUnit,
              nickname,
              idFlow,
              idPriority,
              finalised: false,
            },
            req,
          );

          return res.status(200).json({
            message: `Processo criado com sucesso.`,
            data,
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
      const updatedProcess = await this.processService.updateProcess(req, res);

      if (updatedProcess) {
        return res.status(200).json(updatedProcess);
      }
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  deleteProcess = async (req, res) => {
    try {
      const result = await this.processService.deleteProcessById(
        req.params.idProcess,
        req,
      );

      if (!result) {
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
    try {
      const result = await this.processService.updateProcessStage(req, res);

      if (result) {
        return res.status(200).json({
          message: 'Etapa atualizada com sucesso.',
        });
      }
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  finalizeProcess = async (req, res) => {
    try {
      const finalizedProcess = await this.processService.finalizeProcess(
        req,
        res,
      );

      if (finalizedProcess) {
        return res.status(200).json(finalizedProcess);
      }
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  archiveProcess = async (req, res) => {
    try {
      const archivedProcess = await this.processService.archiveProcess(
        req,
        res,
      );

      if (archivedProcess) {
        return res.status(200).json(archivedProcess);
      }
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };
}
