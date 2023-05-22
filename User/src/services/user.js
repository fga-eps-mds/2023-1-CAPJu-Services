class UserService {
  constructor(UserModel) {
    this.user = UserModel;
  }
  async getAllUsers() {
    return this.user.findAll();
  }

  async getUserByCpf(cpf) {
    return this.user.findAll({ where: { cpf } });
  }
}

export default UserService;
