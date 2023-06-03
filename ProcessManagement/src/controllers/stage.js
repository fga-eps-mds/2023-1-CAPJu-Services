import 'dotenv/config';
import services from '../services/_index.js';

export class StageController {
  constructor() {
    this.stageService = services.stageService;
  }

  getAllStages = async (req, res) => {
    try {
      const stages = await this.stageService.getAllStages();
      if (!stages) {
        return res
          .status(401)
          .json({ message: 'Não existem etapas cadatradas' });
      } else {
        return res.status(200).json(stages);
      }
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar etapas' });
    }
  };
}
