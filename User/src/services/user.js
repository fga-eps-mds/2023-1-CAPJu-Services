class UserService {
  constructor(UserModel) {
    this.user = UserModel;
  }
  async getAllUsers() {
    return this.user.findAll({
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getAcceptedUsers() {
    return this.user.findAll({
      where: { accepted: true },
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getNoAcceptedUsers() {
    return this.user.findAll({
      where: { accepted: false },
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getUserByCpf(cpf) {
    return this.user.findOne({
      where: { cpf },
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getUserByCpfWithPassword(cpf) {
    return this.user.findOne({
      where: { cpf },
    });
  }

  async createUser(data) {
    return this.user.create(data);
  }
}

export default UserService;
