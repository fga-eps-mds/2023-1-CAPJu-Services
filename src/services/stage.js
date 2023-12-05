class StageService {
  constructor(StageModel) {
    this.stage = StageModel;
  }

  async findAll({ where, attributes }) {
    const query = {};
    if (where) query.where = where;
    if (attributes && attributes.length) query.attributes = attributes;

    return this.stage.findAll(query);
  }

  async findOneByStageId(idStage) {
    return this.stage.findOne({
      where: { idStage },
    });
  }

  async createStage(data) {
    return this.stage.create(data);
  }

  async findByUnit(data) {
    return this.stage.findAll(data);
  }

  async countStage(data) {
    return this.stage.count({ data });
  }

  async deleteStage(idStage) {
    return this.stage.destroy({ where: { idStage } });
  }

  async updateStage(idStage, name, duration) {
    let stage = await this.findOneByStageId(idStage);
    console.log(stage.idStage);
    if (stage) {
      const [updatedRows] = await this.stage.update(
        { name: name, duration: duration },
        { where: { idStage: idStage } },
      );
      if (updatedRows) return true;
    }
    return false;
  }
}

export default StageService;
