class FlowStageService {
  constructor(FlowStageModel) {
    this.flowStage = FlowStageModel;
  }
  async getAllFlowStages() {
    return this.flowStage.findAll();
  }

  async createFlowStage(payload) {
    return this.flowStage.create(payload);
  }

  async deleteFlowStageById(idFlow) {
    return this.flowStage.destroy({ where: { idFlow } });
  }
}

export default FlowStageService;
