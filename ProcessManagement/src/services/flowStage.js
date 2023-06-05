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
}

export default FlowStageService;
