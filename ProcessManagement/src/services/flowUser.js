class FlowUserService {
  constructor(FlowUserModel) {
    this.flowUser = FlowUserModel;
  }
  async getAllFlowsUsers() {
    return this.flowUser.findAll();
  }

  async createFlowUser(cpf, idFlow) {
    return this.flowUser.create({ cpf, idFlow });
  }
}

export default FlowUserService;
