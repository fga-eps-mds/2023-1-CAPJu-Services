import 'dotenv/config';
import services from '../services/_index.js';

export class FlowController {
  constructor() {
    this.flowService = services.flowService;
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
}
