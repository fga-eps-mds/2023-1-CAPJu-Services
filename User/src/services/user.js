class UserService {
  constructor(UserModel) {
    this.user = UserModel;
  }
  async getAllUsers() {
    return this.user.findAll();
  }

  async getAcceptedUsers() {
    return this.user.findAll({
      where: { accepted: true },
    });
  }

  async getNoAcceptedUsers() {
    return this.user.findAll({
      where: { accepted: false },
    });
  }

  async getUserByCpf(cpf) {
    return this.user.findAll({ where: { cpf } });
  }
}

export default UserService;
