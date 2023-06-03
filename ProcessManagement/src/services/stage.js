class StageService {
  constructor(StageModel) {
    this.stage = StageModel;
  }
  async getAllStages() {
    return this.stage.findAll();
  }
}

export default StageService;
