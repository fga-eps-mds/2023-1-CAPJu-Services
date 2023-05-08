class UserService {
  constructor(UserModel) {
    this.user = UserModel
  }
  async getAllUsers() {
    return await this.user.findAll();
  }

  async getUserByCpf() {
    return await this.user.findOne({ where: cpf });
  }
}

export default UserService;