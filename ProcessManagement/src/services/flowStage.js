import { Op } from "sequelize";

class FlowStageService {
  constructor(FlowStageModel) {
    this.flowStage = FlowStageModel;
  }
  async getAllFlowStages() {
    return this.flowStage.findAll();
  }

  async getAllFlowsStagesByIdFlow(idFlow) {
    return this.flowStage.findAll({
      where: { idFlow },
    });
  }

  async createFlowStage(payload) {
    return this.flowStage.create(payload);
  }

  async deleteFlowStageById(idFlow) {
    return this.flowStage.destroy({ where: { idFlow } });
  }

  async deleteFlowStageByIdAndStages(idFlow, idStageA, idStageB) {
    return this.flowStage.destroy({
      where: {
        [Op.and]: {
          idFlow,
          idStageA,
          idStageB
        },
      },
    });
  }
}

export default FlowStageService;
