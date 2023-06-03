import 'dotenv/config';
import models from '../models/_index.js';
import FlowStageService from '../services/flowStage.js';

export class FlowStageController {
  constructor() {
    this.flowStageService = new FlowStageService(models.FlowStage);
  }

  getAllFlowsStages = async (req, res) => {
    try {
      const flowStages = await this.flowStageService.getAllFlowStages();
      if (!flowStages) {
        return res
          .status(401)
          .json({ message: 'Não existem fluxos de etapas cadatradas' });
      } else {
        return res.status(200).json(flowStages);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro ao buscar fluxos de etapas' });
    }
  };
}
