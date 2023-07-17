import 'dotenv/config';
import axios from 'axios';
import services from '../services/_index.js';
import { tokenToUser } from '../../middleware/authMiddleware.js';
import { filterByName } from '../utils/filters.js';

export class FlowController {
  constructor() {
    this.flowService = services.flowService;
    this.stageService = services.stageService;
    this.flowStageService = services.flowStageService;
    this.flowUserService = services.flowUserService;
    this.processService = services.processService;
  }

  index = async (_req, res) => {
    try {
      let where;
      const { idRole, idUnit } = await tokenToUser(_req);
      const unitFilter = idRole === 5 ? {} : { idUnit };
      where = {
        ...filterByName(_req),
        ...unitFilter,
      };

      const { limit, offset } = _req.query;

      const flows = await this.flowService.findAll(where, offset, limit);
      const totalCount = await this.flowService.countRows({ where });
      const totalPages = Math.ceil(totalCount / parseInt(_req.query.limit, 10));

      let flowsWithSequences = [];
      for (const flow of flows) {
        const flowStages = await this.flowStageService.findAllByIdFlow(
          flow.idFlow,
        );

        const { stages, sequences } =
          await this.flowService.stagesSequencesFromFlowStages(flowStages);

        const flowSequence = {
          idFlow: flow.idFlow,
          name: flow.name,
          idUnit: flow.idUnit,
          stages,
          sequences,
        };

        flowsWithSequences.push(flowSequence);
      }
      return res
        .status(200)
        .json({ flows: flowsWithSequences || [], totalPages });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };

  showByProcessRecord = async (req, res) => {
    try {
      const { record } = req.params;
      const flowProcesses = await this.processService.getProcessByRecord(
        record,
      );

      if (flowProcesses.length > 0) return res.status(200).json(flowProcesses);

      return res.status(200).json({
        message: `Não há fluxos com o processo`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: `Erro ao buscar fluxos do processo`,
      });
    }
  };

  showByFlowId = async (req, res) => {
    const { idFlow } = req.params;
    try {
      const flow = await this.flowService.findOneByFlowId(idFlow);
      if (!flow)
        return res.status(404).json({ message: `Não há fluxo '${idFlow}'` });

      const flowStages = await this.flowStageService.findAllByIdFlow(
        flow.idFlow,
      );

      const { stages, sequences } =
        await this.flowService.stagesSequencesFromFlowStages(flowStages);

      const flowSequence = {
        idFlow: flow.idFlow,
        name: flow.name,
        idUnit: flow.idUnit,
        stages,
        sequences,
      };

      return res.status(200).json(flowSequence);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: `Impossível obter fluxo ${idFlow}`,
      });
    }
  };

  showByFlowIdWithSequence = async (req, res) => {
    const { idFlow } = req.params;

    try {
      const flow = await this.flowService.findOneByFlowId(idFlow);
      if (!flow)
        return res.status(404).json({ message: `Fluxo ${idFlow} não existe` });

      const flowStages = await this.flowStageService.findAllByIdFlow(idFlow);

      if (flowStages.length === 0) {
        return res
          .status(404)
          .json({ message: `Fluxo ${idFlow} não tem sequências` });
      }

      let sequences = [];

      for (const { idStageA: from, commentary, idStageB: to } of flowStages) {
        sequences.push({ from, commentary, to });
      }
      return res.status(200).json({
        idFlow: flow.idFlow,
        name: flow.name,
        idUnit: flow.idUnit,
        sequences: sequences,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error, message: 'Impossível ler sequências' });
    }
  };

  showUsersToNotify = async (req, res) => {
    const { idFlow } = req.params;
    try {
      const result = await this.flowUserService.findUsersToNotify(idFlow);
      res.status(200).json({ usersToNotify: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error,
        message: 'Impossível obter usuários que devem ser notificados no fluxo',
      });
    }
  };

  store = async (req, res) => {
    try {
      const { name, idUnit, sequences, idUsersToNotify } = req.body;

      for (const cpf of idUsersToNotify) {
        const user = await axios.get(
          `${process.env.USER_URL_API}/user/${cpf}/unit/${idUnit}`,
        );

        if (!user.data) {
          return res.status(404).json({
            message: `Usuário '${cpf}' não existe na unidade '${idUnit}'`,
          });
        }
      }

      if (sequences.length < 1)
        return res
          .status(404)
          .json({ message: 'Necessário pelo menos duas etapas!' });

      for (const sequence of sequences) {
        const { from: idStageA, to: idStageB } = sequence;
        if (idStageA == idStageB)
          return res
            .status(400)
            .json({ message: 'Sequências devem ter início e fim diferentes' });
        if (!(await this.stageService.findOneByStageId(idStageA)).dataValues)
          return res.status(400).json({
            message: `Não existe a etapa com identificador '${idStageA}'`,
          });
        if (!(await this.stageService.findOneByStageId(idStageB)).dataValues)
          return res.status(400).json({
            message: `Não existe a etapa com identificador '${idStageA}'`,
          });
      }

      const flow = await this.flowService.createFlow({ name, idUnit });

      for (const sequence of sequences) {
        const data = {
          idFlow: flow.idFlow,
          idStageA: sequence.from,
          idStageB: sequence.to,
          commentary: sequence.commentary,
        };
        await this.flowStageService.createFlowStage(data);
      }

      for (const cpf of idUsersToNotify) {
        await this.flowUserService.createFlowUser(cpf, flow.idFlow);
      }

      return res.status(200).json({
        idFlow: flow.idFlow,
        name: flow.name,
        idUnit: idUnit,
        sequences,
        usersToNotify: idUsersToNotify,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao criar fluxo' });
    }
  };

  update = async (req, res) => {
    const { name, idFlow, idUnit, sequences, idUsersToNotify } = req.body;

    try {
      const flow = await this.flowService.findOneByFlowId(idFlow);
      if (!flow) {
        return res
          .status(404)
          .json({ message: `Fluxo '${idFlow} não existe!` });
      } else {
        const updatedFlow = await this.flowService.updateFlow(name, idFlow);
        if (updatedFlow === false) {
          return res.status(404).json({ message: `Impossível editar o fluxo` });
        }

        for (const cpf of idUsersToNotify) {
          const user = await axios.get(
            `${process.env.USER_URL_API}/user/${cpf}/unit/${idUnit}`,
          );

          if (!user.data) {
            return res.status(404).json({
              message: `Usuário '${cpf}' não existe na unidade '${idUnit}'`,
            });
          }
        }

        if (sequences.length < 1)
          return res
            .status(404)
            .json({ message: 'Necessário pelo menos duas etapas!' });

        for (const sequence of sequences) {
          const { from: idStageA, to: idStageB } = sequence;
          if (idStageA == idStageB)
            return res.status(400).json({
              message: 'Sequências devem ter início e fim diferentes',
            });
          if (!(await this.stageService.findOneByStageId(idStageA)).dataValues)
            return res.status(400).json({
              message: `Não existe a etapa com identificador '${idStageA}'`,
            });
          if (!(await this.stageService.findOneByStageId(idStageB)).dataValues)
            return res.status(400).json({
              message: `Não existe a etapa com identificador '${idStageA}'`,
            });
        }

        for (const sequence of sequences) {
          const data = {
            idFlow: updatedFlow.idFlow,
            idStageA: sequence.from,
            idStageB: sequence.to,
            commentary: sequence.commentary,
          };
          await this.flowStageService.createFlowStage(data);
        }

        for (const cpf of idUsersToNotify) {
          await this.flowUserService.createFlowUser(cpf, updatedFlow.idFlow);
        }

        return res.status(200).json({
          idFlow: updatedFlow.idFlow,
          name: updatedFlow.name,
          idUnit: idUnit,
          sequences,
          usersToNotify: idUsersToNotify,
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error, message: 'Impossível editar fluxo' });
    }
  };

  delete = async (req, res) => {
    try {
      const { idFlow } = req.params;
      const processes = await this.processService.getProcessByIdFlow(idFlow);
      if (processes.length > 0) {
        return res.status(409).json({
          error: 'Há processos no fluxo',
          message: `Há ${processes.length} processos no fluxo`,
        });
      }
      await this.flowStageService.deleteFlowStageByIdFlow(idFlow);
      await this.flowUserService.deleteFlowUserById(idFlow);

      const flow = await this.flowService.deleteFlowById(idFlow);
      if (flow)
        return res.status(200).json({ message: 'Fluxo apagado com sucesso' });
      else return res.status(404).json({ message: 'Fluxo não encontrado' });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error, message: 'Impossível apagar fluxo' });
    }
  };
}
