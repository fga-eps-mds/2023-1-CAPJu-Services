import { Op } from 'sequelize';

class FlowProcessService {
  constructor(FlowProcessModel) {
    this.flowProcess = FlowProcessModel;
  }

  async findAll() {
    console.log('foi?');
    return this.flowProcess.findAll();
  }
}

export default FlowProcessService;
