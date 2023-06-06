class ProcessService {
  constructor(ProcessModel) {
    this.process = ProcessModel;
  }
  async getAllProcess() {
    return this.process.findAll();
  }

  async getProcessByRecord(record) {
    return this.process.findOne({ where: { record } });
  }

  async getProcessByIdFlow(idFlow) {
    return this.process.all({ where: { idFlow } });
  }
}

export default ProcessService;
