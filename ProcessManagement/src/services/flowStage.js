import { Op } from 'sequelize';

class FlowStageService {
  constructor(FlowStageModel) {
    this.flowStage = FlowStageModel;
  }
  async findAll() {
    return this.flowStage.findAll();
  }

  async findAllByIdFlow(idFlow) {
    return this.flowStage.findAll({
      where: { idFlow },
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
