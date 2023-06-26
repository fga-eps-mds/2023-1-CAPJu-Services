class ProcessService {
  constructor(ProcessModel) {
    this.process = ProcessModel;
  }

  async createProcess(params) {
    return await this.process.create(params);
  }

  async updateProcess(params) {
    return await this.process.update(params);
  }

  async deleteProcessByRecord(record) {
    return await this.process.destroy({ where: { record } });
  }

  async getAllProcess() {
    return await this.process.findAll();
  }

  async getProcessByUniqueKeys(record, idFlow) {
    return await this.process.findAll({ where: { record, idFlow } });
  }

  async getProcessByRecord(record) {
    return await this.process.findAll({ where: { record } });
  }

  async getProcessByIdFlow(idFlow) {
    return await this.process.findAll({ where: { idFlow } });
  }

  validateRecord(record) {
    const filtered = filterRecord(record);
    return {
      filtered,
      valid: isRecordValid(filtered),
    };
  };

  filterRecord(record) {
    const regex = /[^\d]/g;
    return record.replace(regex, "");
  };

  isRecordValid(record) {
    const regex = /^\d{20}$/;
    return regex.test(record);
  };
}

export default ProcessService;
