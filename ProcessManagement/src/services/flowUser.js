class FlowUserService {
  constructor(FlowUserModel) {
    this.flowUser = FlowUserModel;
  }
  async getAllFlowsUsers() {
    return this.flowUser.findAll();
  }
}

export default FlowUserService;
