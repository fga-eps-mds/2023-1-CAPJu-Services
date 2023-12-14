import 'dotenv/config';
import services from '../services/_index.js';

export class FlowStageController {
  constructor() {
    this.flowStageService = services.flowStageService;
  }

  index = async (_req, res) => {
    try {
      const flowStages = await this.flowStageService.findAll();

      if (!flowStages) {
        return res
          .status(404)
          .json({ message: 'Não há fluxos ligados a etapas' });
      }

      return res.status(200).json(flowStages);
    } catch (error) {
      return res
        .status(500)
        .json({ error, message: 'Erro ao ler fluxos ligados a etapas' });
    }
  };

  getFlowStagesByFlowId = async (req, res) => {
    const { idFlow } = req.params;

    try {
      const stages = await this.flowStageService.findFlowStagesByFlowId(idFlow);

      if (!stages) {
        return res
          .status(404)
          .json({ message: `Erro ao buscar etapas do fluxo` });
      }

      return res.status(200).json(stages);
    } catch (error) {
      return res.status(500).json({ message: 'Erro a ler as etapas do fluxo' });
    }
  };

  delete = async (req, res) => {
    const { idFlow, idStageA, idStageB } = req.params;

    try {
      const deletedFlowStage =
        await this.flowStageService.deleteFlowStageByIdFlowAndStages(
          idFlow,
          idStageA,
          idStageB,
        );

      if (deletedFlowStage === 0) {
        return res.status(404).json({
          message: `Não há relacionamento entre o fluxo '${idFlow}' e as etapas '${idStageA}' e '${idStageB}'`,
        });
      }

      return res.status(200).json({
        message: `Desassociação entre fluxo '${idFlow}' e etapas '${idStageA}' e '${idStageB}' concluída`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: `Falha ao desassociar fluxo '${idFlow}' e etapas '${idStageA}' e '${idStageB}'`,
      });
    }
  };
}
