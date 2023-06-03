import 'dotenv/config';
import services from '../services/_index.js';

export class FlowStageController {
  constructor() {
    this.flowStageService = services.flowStageService;
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
