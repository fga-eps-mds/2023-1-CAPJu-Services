import 'dotenv/config';
import axios from 'axios';
import services from '../services/_index.js';
import { getUserRoleAndUnitFilterFromReq } from '../../middleware/authMiddleware.js';
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
      where = {
        ...filterByName(_req),
        ...(await getUserRoleAndUnitFilterFromReq(_req)),
      };

      const { limit, offset } = _req.query;

      const flows = await this.flowService.findAll(
        where,
        undefined,
        offset,
        limit,
      );

      const totalCount = await this.flowService.countRows({ where });
      const totalPages = Math.ceil(totalCount / parseInt(_req.query.limit, 10));

      let flowsWithSequences = [];
      const idFlows = flows.map(f => f.idFlow);
      const flowsStages = await this.flowStageService.findAllByIdFlow(
        idFlows,
        undefined,
        ['idFlow', 'idStageA', 'idStageB', 'commentary'],
      );

      for (const flow of flows) {
        const flowStages = flowsStages.filter(fS => fS.idFlow === flow.idFlow);

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

  showHistoricByFlowId = async (req, res) => {
    try {
      const { idFlow } = req.params;
      let flowHistoric = await this.flowService.getHistoricByFlowId(idFlow);
      if (flowHistoric.length > 0) {
        let stages = await this.flowStageService.findAllByIdFlow(idFlow);
        const umDiaEmMilissegundos = 24 * 60 * 60 * 1000;

        let grupos = {};

        flowHistoric.forEach(historic => {
          const idProcess = historic.idProcess;
          const effectiveDate = historic.changedAt;
          const newValues = JSON.parse(historic.newValues);
          let { idStage, finalised: finished } = newValues;

          if (!grupos[idProcess]) {
            grupos[idProcess] = {};
          }

          if (finished) {
            grupos[idProcess].finalised = historic.changedAt;
          } else if (!grupos[idProcess][idStage]) {
            grupos[idProcess][idStage] = {
              first: effectiveDate,
              last: effectiveDate,
            };
          } else {
            grupos[idProcess][idStage].last = effectiveDate;
          }
        });

        let tempoTotal = new Array(stages.length + 1).fill(0);
        let qtdEtapas = new Array(stages.length + 1).fill(0);
        let at = 0;

        stages.forEach(stage => {
          const begin = stage.idStageA;
          const end = stage.idStageB;

          let timeFirst;
          let timeLast;
          Object.values(grupos).forEach(trem => {
            console.log(trem);
            if (trem[begin]) {
              timeFirst = trem[begin].first;
            }
            if (trem[end]) {
              timeLast = trem[end].last;
            } else if (!trem.finalised) {
              return;
            }

            const dateA = new Date(timeFirst);
            const dateB = new Date(timeLast);
            const deltaDate = dateB - dateA;

            const tempoEtapa = Math.ceil(deltaDate / umDiaEmMilissegundos);

            tempoTotal[at] += tempoEtapa;
            qtdEtapas[at]++;

            console.log(
              '----------------> AT =',
              at + 1,
              stages.length,
              trem.finalised,
              '\n',
            );
            if (at + 1 == stages.length && trem.finalised) {
              const dateC = new Date(trem.finalised);
              const deltaDateEnd = dateC - dateB;
              const tempoEtapaEnd = Math.ceil(
                deltaDateEnd / umDiaEmMilissegundos,
              );
              tempoTotal[at + 1] += tempoEtapaEnd;
              qtdEtapas[at + 1]++;
            }
          });

          at++;
        });

        const resultado = tempoTotal.map((elemento, indice) => {
          if (qtdEtapas[indice] !== 0) {
            return elemento / qtdEtapas[indice];
          } else {
            return 0;
          }
        });

        return res.status(200).json(resultado);
      }
      return res.status(404).json({
        message: `Não há dados sobre o fluxos`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: `Erro ao buscar o histórico de alteraçõe dos processos de um fluxos`,
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
          `http://localhost:8080/${cpf}/unit/${idUnit}`,
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
      console.log(error);
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

        await this.flowStageService.deleteFlowStageByIdFlow(updatedFlow.idFlow);
        
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
      await this.flowStageService.deleteFlowStageByIdFlow(idFlow);
      await this.flowUserService.deleteFlowUserById(idFlow);
      await this.processService.deleteByIdFlow(idFlow);
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
