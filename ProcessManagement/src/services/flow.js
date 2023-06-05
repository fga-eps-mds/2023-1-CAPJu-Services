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

  async deleteFlowById(idFlow) {
    return await this.flow.destroy({ where: { idFlow } });
  }
}

export default FlowService;
