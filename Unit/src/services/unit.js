class UnitService {
  constructor(UnitModel) {
    this.unit = UnitModel;
  }
  async getAllUnits() {
    return this.unit.findAll();
  }

  async createUnit(name) {
    return this.unit.create({ name });
  }

  async getUnitById(idUnit) {
    return this.unit.findOne({
      where: { idUnit },
    });
  }

  async updateUnit(idUnit, name) {
    const unit = await this.getUnitById(idUnit);
    if (unit) {
      const [updatedRows] = await this.unit.update(
        { name: name },
        { where: { idUnit: idUnit } },
      );
      if (updatedRows) return true;
    }
    return false;
  }

  async deleteUnit(idUnit) {
    const unit = await this.getUnitById(idUnit);
    if (unit) {
      const [updatedRows] = await this.unit.destroy({ where: { idUnit } });
      if (updatedRows) return true;
    }
    return false;
  }
}

export default UnitService;
