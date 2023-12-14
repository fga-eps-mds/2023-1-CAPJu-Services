import { Op, QueryTypes } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';
import 'dotenv/config.js';

class FlowStageService {
  constructor(FlowStageModel) {
    this.flowStage = FlowStageModel;
  }

  async findAll(where) {
    return this.flowStage.findAll({
      where,
      order: [['idFlowStage', 'ASC']],
      raw: true,
    }); // This ordering is crucial to get the stages order correctly
  }

  async findAllByIdFlow(idFlow, limit, attributes) {
    return this.flowStage.findAll({
      where: { idFlow },
      limit: limit !== undefined ? limit : undefined,
      raw: true,
      attributes: attributes,
      distinct: true,
    });
  }

  async findFlowStagesByFlowId(idFlow) {
    const query_results = await sequelizeConfig.query(
      `
      SELECT tbl."idStage", tbl.name, tbl.duration FROM(
        SELECT 'Tabela 1' AS origem, F."idFlowStage", S."idStage", S.name, S.duration FROM "flowStage" F
          INNER JOIN stage S ON S."idStage" = F."idStageA"
          WHERE F."idFlow"  = ?
        UNION
          (SELECT 'Tabela 2' AS origem, F."idFlowStage", S."idStage", S.name, S.duration FROM "flowStage" F
          INNER JOIN stage S ON S."idStage" = F."idStageB"
          WHERE F."idFlow"  = ?
          ORDER BY F."idFlowStage"  DESC
          LIMIT 1)
          ) tbl
        ORDER BY tbl.origem
      `,
      {
        replacements: [idFlow, idFlow],
        type: QueryTypes.SELECT,
      },
    );

    return query_results;
  }

  async createFlowStage(payload) {
    return this.flowStage.create(payload);
  }

  async deleteFlowStageByIdFlow(idFlow) {
    return this.flowStage.destroy({ where: { idFlow } });
  }

  async deleteFlowStageByIdFlowAndStages(idFlow, idStageA, idStageB) {
    return this.flowStage.destroy({
      where: {
        [Op.and]: {
          idFlow,
          idStageA,
          idStageB,
        },
      },
    });
  }
}

export default FlowStageService;
