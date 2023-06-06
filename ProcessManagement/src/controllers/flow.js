import 'dotenv/config';
import axios from 'axios';
import services from '../services/_index.js';

export class FlowController {
  constructor() {
    this.flowService = services.flowService;
    this.stageService = services.stageService;
    this.flowStageService = services.flowStageService;
    this.flowUserService = services.flowUserService;
    this.processService = services.processService;
  }


  indexByRecord = async (req, res) => {
    const { record } = req.params;

    // try {
    //   const flowProcesses = await FlowProcess.findAll({
    //     where: { record },
    //   });

    //   if (flowProcesses.length > 0) {
    //     return res.status(200).json(flowProcesses);
    //   }

    //   return res.status(404).json({
    //     error: "Não há fluxos com esse processo",
    //     message: `Não há fluxos com o processo '${record}'`,
    //   });
    // } catch (error) {
    //   console.log(error);
    //   return res.status(500).json({
    //     error,
    //     message: `Erro ao buscar fluxos do processo ${record}`,
    //   });
    // }
  }

  getAllFlows = async (req, res) => {
    try {
      const priorities = await this.flowService.getAllFlows();
      if (!priorities) {
        return res
          .status(401)
          .json({ message: 'Não existem fluxos cadatradas' });
      } else {
        return res.status(200).json(priorities);
      }
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar fluxo' });
    }
  };



  store = async (req, res) => {
    try {
      const { name, idUnit, sequences, idUsersToNotify } = req.body;

      for (const cpf of idUsersToNotify) {
        await axios.get(
          `${process.env.USER_URL_API}/user/${cpf}/unit/${idUnit}`,
        );
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
        if (!(await this.stageService.getStageById(idStageA)).dataValues)
          return res.status(400).json({
            message: `Não existe a etapa com identificador '${idStageA}'`,
          });
        if (!(await this.stageService.getStageById(idStageB)).dataValues)
          return res.status(400).json({
            message: `Não existe a etapa com identificador '${idStageA}'`,
          });
      }

      const flow = await this.flowService.createFlow(name, idUnit);

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

  delete = async (req, res) => {
    try {
      const { idFlow } = req.params;
      const processes = await this.processService.getProcessByIdFlow({ where: { idFlow } });
      if (processes.length > 0) {
        return res.status(409).json({
          error: "Há processos no fluxo",
          message: `Há ${processes.length} processos no fluxo`,
        });
      }
      await this.flowStageService.deleteFlowStageById(idFlow);
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
