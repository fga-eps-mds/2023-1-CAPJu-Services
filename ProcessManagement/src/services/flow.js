class FlowService {
  constructor(FlowModel) {
    this.flow = FlowModel;
  }
  async getAllFlows() {
    return this.flow.findAll();
  }

  async createFlow(name, idUnit) {
    return this.flow.create({ name, idUnit });
  }
}

export default FlowService;
