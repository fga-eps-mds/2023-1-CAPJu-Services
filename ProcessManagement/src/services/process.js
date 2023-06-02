class ProcessService {
  constructor(ProcessModel) {
    this.process = ProcessModel;
  }
  async getAllProcess() {
    return this.process.findAll();
  }
}

export default ProcessService;
