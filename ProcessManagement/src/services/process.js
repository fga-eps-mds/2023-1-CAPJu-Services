class ProcessService {
  constructor(ProcessModel) {
    this.process = ProcessModel;
  }
  async getAllProcess() {
    return this.process.findAll();
  }

  async getProcessByRecord(record) {
    return this.process.findAll({ where: { record } });
  }

  async getProcessByIdFlow(idFlow) {
    return this.process.findAll({ where: { idFlow } });
  }
}

export default ProcessService;
