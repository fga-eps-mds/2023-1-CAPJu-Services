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

  async deleteFlowUserById(idFlow) {
    return this.flowUser.destroy({ where: { idFlow } });
  }
}

export default FlowUserService;
