import 'dotenv/config';
import models from '../models/_index.js';
import StageService from '../services/stage.js';

export class StageController {
  constructor() {
    this.stageService = new StageService(models.Stage);
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
