class UserService {
  constructor (UserModel) {
    this.user = UserModel
  }

  async getAllUsers () {
    const users = await this.user.findAll()
    return users
  }
}

export default UserService;