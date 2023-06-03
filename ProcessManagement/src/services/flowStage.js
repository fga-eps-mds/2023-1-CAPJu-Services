class FlowStageService {
  constructor(FlowStageModel) {
    this.flowStage = FlowStageModel;
  }
  async getAllFlowStages() {
    return this.flowStage.findAll();
  }
}

export default FlowStageService;
