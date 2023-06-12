class StageService {
  constructor(StageModel) {
    this.stage = StageModel;
  }
  async findAll() {
    return this.stage.findAll();
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
