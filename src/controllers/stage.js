import 'dotenv/config';
import services from '../services/_index.js';
import { filterByName } from '../utils/filters.js';
import {
  getUserRoleAndUnitFilterFromReq,
  userFromReq,
} from '../../middleware/authMiddleware.js';

export class StageController {
  constructor() {
    this.stageService = services.stageService;
  }

  index = async (req, res) => {
    try {
      let limit;
      let where = {
        ...filterByName(req),
        ...(await getUserRoleAndUnitFilterFromReq(req)),
      };

      const data = { where, offset: req.query.offset, limit: req.query.limit };
      const stages = await this.stageService.findByUnit(data);
      const totalCount = await this.stageService.countStage(where);
      const totalPages = Math.ceil(totalCount / parseInt(limit, 10));

      if (!stages || stages.length === 0) {
        return res.status(204).json([]);
      } else {
        return res.status(200).json({ stages: stages || [], totalPages });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Erro ao buscar etapas' });
    }
  };

  showStageByStageId = async (req, res) => {
    try {
      const { idStage } = req.params;
      const stage = await this.stageService.findOneByStageId(idStage);
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
    const { name, duration } = req.body;
    const idUnit = (await userFromReq(req)).unit.idUnit;
    try {
      const data = {
        name: name.trim(),
        idUnit,
        duration,
      };
      const stage = await this.stageService.createStage(data);
      return res.status(200).json(stage);
    } catch (error) {
      return res.status(error).json(error);
    }
  };

  update = async (req, res) => {
    try {
      const { name, duration } = req.body;
      const idUnit = (await userFromReq(req)).unit.idUnit;
      const updated = await this.stageService.updateStage(
        idUnit,
        name,
        duration,
      );
      if (updated) {
        return res.status(200).json({
          message: 'Etapa atualizada com sucesso',
        });
      } else {
        return res.status(404).json({
          message: 'Essa etapa não existe!',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error,
        message: 'Erro ao atualizar etapa',
      });
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
