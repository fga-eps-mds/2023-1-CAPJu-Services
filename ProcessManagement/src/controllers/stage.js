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

  getStageById = async (req, res) => {
    try {
      const { idStage } = req.params;
      const stage = await this.stageService.getStageById(idStage);
      if (!stage) {
        return res.status(401).json({ error: 'Essa etapa não existe' });
      } else {
        return res.status(200).json(stage);
      }
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar etapas' });
    }
  };

  store = async (req, res) => {
    const { name, idUnit, duration } = req.body;
    try {
      const data = {
        name: name.toLowerCase(),
        idUnit,
        duration,
      };
      const stage = await this.stageService.createStage(data);
      return res.status(200).json(stage);
    } catch (error) {
      return res.status(error).json(error);
    }
  };

  delete = async (req, res) => {
    const { idStage } = req.params;
    try {
      const stage = await this.stageService.deleteStage(idStage);
      if (stage) return res.status(200).json(stage);
      else return res.status(401).json({ error: 'Etapa não encontrada' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao deletar etapa' });
    }
  };
}
