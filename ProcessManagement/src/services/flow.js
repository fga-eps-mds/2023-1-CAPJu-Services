class FlowService {
  constructor(FlowModel) {
    this.flow = FlowModel;
  }
  async getAllFlows() {
    return this.flow.findAll();
  }

  async getFlowById(idFlow) {
    return this.flow.findOne({
      where: { idFlow },
    });
  }

  async createFlow(name, idUnit) {
    return this.flow.create({ name, idUnit });
  }

  async deleteFlowById(idFlow) {
    return await this.flow.destroy({ where: { idFlow } });
  }

  async stagesSequencesFromFlowStages(flowStages) {
    let sequences = [];
    let stages = [];
    if (flowStages.length > 0) {
      for (const { idStageA: from, commentary, idStageB: to } of flowStages) {
        sequences.push({ from, commentary, to });
        if (!stages.includes(from)) {
          stages.push(from);
        }
        if (!stages.includes(to)) {
          stages.push(to);
        }
      }
    }
    return { stages, sequences };
  }
}

export default FlowService;
