class FlowService {
  constructor(FlowModel) {
    this.flow = FlowModel;
  }

  async findAll(where, attributes, offset, limit) {

    const options = {
      where: where,
      offset: offset || 0,
      attributes,
    };

    if (limit !== Infinity) {
      options.limit = limit;
    }

    return this.flow.findAll(options);
  }

  async findAllRawWithAttributes(where, attributes) {

    const options = {
      where,
      attributes,
      raw: true,
    };

    return this.flow.findAll(options);
  }

  async countRows({ where }) {
    return this.flow.count({ where });
  }

  async findOneByFlowId(idFlow, attributes) {
    const query = {
      where: { idFlow }
    };

    if (attributes && attributes.length) {
      query.attributes = attributes;
    }

    return this.flow.findOne(query);
  }


  async createFlow(params) {
    return this.flow.create(params);
  }

  async updateFlow(name, idFlow) {
    const [updatedRows] = await this.flow.update(
      { name },
      { where: { idFlow } },
    );
    if (updatedRows) {
      const updatedFlow = await this.findOneByFlowId(idFlow);
      return updatedFlow;
    } else {
      return false;
    }
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
