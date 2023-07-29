class ProcessService {
  constructor(ProcessModel) {
    this.process = ProcessModel;
  }

  async createProcess(params) {
    return await this.process.create(params);
  }

  async updateProcess(params, record) {
    const updatedRows = await this.process.update(
      { ...params },
      { where: { record } },
    );
    if (updatedRows) {
      return await this.getProcessByRecord(record);
    } else {
      return false;
    }
  }

  async deleteProcessByRecord(record) {
    return await this.process.destroy({ where: { record } });
  }

  async getAllProcess(where) {
    return await this.process.findAll(where);
  }

  async getPriorityProcess() {
    return await this.process.findAll({
      where: { idPriority: [1, 2, 3, 4, 5, 6, 7, 8] },
    });
  }

  async getProcessByUniqueKeys(record, idFlow) {
    return await this.process.findOne({
      where: { record, idFlow },
    });
  }

  async getProcessByRecord(record) {
    return await this.process.findOne({
      where: { record },
    });
  }

  async getProcessByIdFlow(idFlow) {
    return await this.process.findAll({ where: { idFlow } });
  }

  validateRecord(record) {
    const filteredRecord = record.replace(/[^\d]/g, '');
    const regexFilter = /^\d{20}$/;
    const isRecordValid = regexFilter.test(filteredRecord);

    return {
      filteredRecord,
      valid: isRecordValid,
    };
  }

  async countRows({ where }) {
    return this.process.count({ where });
  }
}

export default ProcessService;
