class PriorityService {
  constructor(PriorityModel) {
    this.priority = PriorityModel;
  }
  async findAll() {
    return this.priority.findAll();
  }
}

export default PriorityService;
