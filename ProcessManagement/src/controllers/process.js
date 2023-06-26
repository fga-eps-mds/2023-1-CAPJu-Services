import 'dotenv/config';
import services from '../services/_index.js';

export class ProcessController {
  constructor() {
    this.processService = services.processService;
    this.priorityService = services.priorityService;
    this.flowStageService = services.flowStageService;
  }

  index = async (_req, res) => {
    try {
      const process = await this.processService.getAllProcess();
      if (!process) {
        return res
          .status(404)
          .json({ message: 'Não Existem processos cadatrados' });
      } else {
        return res.status(200).json(process);
      }
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar processos' });
    }
  };

  getProcessByRecord = async (req, res) => {
    const { record } = req.params;
    try {
      const process = await this.processService.getProcessByRecord(record);
      if (!process) {
        return res.status(404).json({
          error: "Esse processo não existe!",
          message: "Esse processo não existe!",
        });
      } else {
        return res.status(200).json(process);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: `Erro ao procurar processo`,
      });
    }
  }

  getProcessByIdFlow = async (req, res) => {
    const idFlow = req.params.idFlow;
    try {
      const process = await this.processService.getProcessByIdFlow(idFlow);
      if (!process) {
        return res.status(404).json({
          error: "Processos não encontrados nesse fluxo!",
          message: "Processos não encontrados nesse fluxo!",
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
  }

  getProcessByUniqueKeys = async (req, res) => {
    const { record, idFlow } = req.params;
    try {
      const process = await this.processService.getProcessByUniqueKeys(
        record,
        idFlow
      );
      if (!process) {
        return res.status(404).json({
          error: "Esse processo não existe nesse fluxo!",
          message: "Esse processo não existe nesse fluxo!",
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
  }

  store = async (req, res) => {
    try {
      let { record, nickname, idPriority, idFlow } = req.body;

      const recordStatus = this.processService.validateRecord(record);

      if (!recordStatus.valid) {
        return res.status(400).json({
          error: "Registro fora do padrão CNJ",
          message: `Registro '${req.body?.record}' está fora do padrão CNJ`,
        });
      }

      record = recordStatus.filtered;

      const flow = await this.processService.getProcessByIdFlow(idFlow);

      try {
        if (flow) {
          await this.processService.createProcess({
            record,
            idUnit: flow.idUnit,
            nickname,
            idFlow,
            idPriority: idPriority,
            finalised: false,
          });

          return res
            .status(200)
            .json({ message: "Processo criado com sucesso!" });
        }
      } catch (error) {
        return res.status(500).json({
          error,
          message: `Erro ao criar processo.`,
        });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  getPriorityProcess = async (_req, res) => {
    try {
      const priorityProcesses = await this.processService.findAll({
        where: {
          idPriority: [1, 2, 3, 4, 5, 6, 7, 8],
        },
      });

      if (!priorityProcesses) {
        return res
          .status(404)
          .json({ error: "Não há processos com prioridade legal." });
      } else {
        return res.status(200).json(priorityProcesses);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  updateProcess = async (req, res) => {
    try {
      const {
        idFlow,
        nickname,
        priority,
        status,
        idStage,
      } = req.body;

      const recordStatus = this.processService.validateRecord(req.body.record);

      if (!recordStatus.valid) {
        return res.status(400).json({
          error: "Registro fora do padrão CNJ",
          message: `Registro '${req.body.record}' está fora do padrão CNJ`,
        });
      }

      const record = recordStatus.filtered;

      const process = await this.processService.getProcessByRecord(record);

      const flowStages = await this.flowStageService.findAll({
        where: { idFlow },
      });

      if (flowStages.length === 0) {
        return res.status(404).json({ error: "Não há etapas neste fluxo" });
      }

      if (!process) {
        return res.status(404).json({ error: "processo inexistente" });
      }

      const startingProcess =
        process.status === "notStarted" && status === "inProgress"
          ? {
            idStage: flowStages[0].idStageA,
            effectiveDate: new Date(),
          }
          : {};

      this.processService.updateProcess({
        nickname,
        idStage: idStage || process.idStage,
        idPriority: priority,
        status,
        ...startingProcess,
      });

      return res.status(200).json({ process });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  deleteProcess = async (req, res) => {
    try {
      const result = await this.processService.deleteProcessByRecord(req.params.record);

      if (result === 0) {
        return res
          .status(404)
          .json({ error: `Não há registro ${req.params.record}.` });
      }

      return res.status(200).json({ message: "Processo apagado." });
    } catch (error) {
      return res.status(500).json({ error, message: "Erro ao apagar processo." });
    }
  }

  updateProcessStage = async (req, res) => {
    const { record, from, to, idFlow } = req.body;

    if (
      isNaN(parseInt(from)) ||
      isNaN(parseInt(to)) ||
      isNaN(parseInt(idFlow))
    ) {
      return res.status(400).json({
        error: "Identificadores inválidos",
        message: `Identificadores '${idFlow}', '${from}', ou '${to}' são inválidos`,
      });
    }

    try {
      const flowStages = await this.flowStageService.findAll({
        where: { idFlow },
      });

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
          error: "Transição impossível",
          message: `Não há a transição da etapa '${to}' para '${from}' no fluxo '${idFlow}'`,
        });
      }
      const result = this.processService.updateProcess(
        {
          idStage: to,
          effectiveDate: new Date(),
        },
        {
          where: {
            record,
            idStage: from,
          },
        }
      );
      if (result > 0) {
        return res.status(200).json({
          message: "Etapa atualizada com sucesso.",
        });
      }

      return res.status(400).json({ message: "Erro ao atualizar processo." });
    } catch (error) {
      return res.status(500).json({
        error,
        message: `Erro ao atualizar processo '${record}' para etapa '${to}`,
      });
    }
  }
}
