class StageService {
  constructor(StageModel) {
    this.stage = StageModel;
  }

  async findAll(offset = 0, limit = 10) {
    return this.stage.findAll({
      where,
      offset,
      limit,
    });
  }

  async findOneByStageId(idStage) {
    return this.stage.findOne({
      where: { idStage },
    });
  }

  async createStage(data) {
    return this.stage.create(data);
  }

  async deleteStage(idStage) {
    return this.stage.destroy({ where: { idStage } });
  }
}

export default StageService;
