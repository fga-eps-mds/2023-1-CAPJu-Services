import { Op } from 'sequelize';

class FlowStageService {
  constructor(FlowStageModel) {
    this.flowStage = FlowStageModel;
  }

  async findAll(where) {
    return this.flowStage.findAll({ where, order: [['idFlowStage', 'ASC']], raw: true }); // This ordering is crucial to get the stages order correctly
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
