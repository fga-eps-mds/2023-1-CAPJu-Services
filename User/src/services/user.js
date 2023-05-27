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

  async updateUserEmail(cpf, email) {
    const user = await this.getUserByCpf(cpf);
    if (user) {
      const [updatedRows] = await this.user.update(
        { email: email },
        { where: { cpf: cpf } },
      );
      if (updatedRows) return true;
    }
    return false;
  }

  async updateUserRole(cpf, idRole) {
    const user = await this.getUserByCpf(cpf);
    if (user) {
      const [updatedRows] = await this.user.update(
        { idRole: idRole },
        { where: { cpf: cpf } },
      );
      if (updatedRows) return true;
    }
    return false;
  }
  async updateUserPassword(cpf, oldPassword, newPassword) {
    const user = await this.getUserByCpfWithPassword(cpf);
    if (user) {
      if (user.password === oldPassword) {
        const [updatedRows] = await this.user.update(
          { password: newPassword },
          { where: { cpf: cpf } },
        );
        if (updatedRows) return true;
      }
    }
    return false;
  }
}

export default UserService;
