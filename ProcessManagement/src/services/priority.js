class PriorityService {
  constructor(PriorityModel) {
    this.priority = PriorityModel;
  }
  async getAllPriorities() {
    return this.priority.findAll();
  }
}

export default PriorityService;
