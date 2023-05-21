class UserService {
  constructor(UserModel) {
    this.user = UserModel;
  }
  async getAllUsers() {
    return await this.user.findAll();
  }

  async getUserByCpf(cpf) {
    return await this.user.findAll({ where: { cpf } });
  }
}

export default UserService;
