class FlowService {
  constructor(FlowModel) {
    this.flow = FlowModel;
  }
  async getAllFlows() {
    return this.flow.findAll();
  }
}

export default FlowService;
