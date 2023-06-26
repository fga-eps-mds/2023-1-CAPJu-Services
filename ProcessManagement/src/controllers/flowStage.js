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
      console.log(error);
      return res
        .status(500)
        .json({ error, message: 'Erro ao ler fluxos ligados a etapas' });
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
          message: `Não há relacionameto entre o fluxo '${idFlow}' e as etapas '${idStageA}' e '${idStageB}'`,
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
