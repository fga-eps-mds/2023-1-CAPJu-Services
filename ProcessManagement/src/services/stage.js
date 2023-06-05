class StageService {
  constructor(StageModel) {
    this.stage = StageModel;
  }
  async getAllStages() {
    return this.stage.findAll();
  }

  async getStageById(idStage) {
    return this.stage.findOne({
      where: { idStage },
    });
  }

  async createStage(data) {
    return this.stage.create(data);
  }

  async deleteStage(idStage) {
    return this.stage.destroy({ where: { idStage: idStage } });
  }
}

export default StageService;
