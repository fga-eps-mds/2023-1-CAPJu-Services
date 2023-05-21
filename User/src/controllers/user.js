import models from '../models/index.js';
import UserService from '../services/user.js';

export class UserController {
  constructor() {
    this.userService = new UserService(models.User);
  }

  index = async (req, res, next) => {
    console.log(`UserController => getAllUsers`);
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({
        message: 'Usuários encontrados com sucesso!',
        data: users,
      });
    } catch (error) {
      console.log(`getAllUsers ERROR: ${error}`);
      return res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  };

  getUserByCpf = async (req, res, next) => {
    console.log(`UserController => getUserByCpf`);
    try {
      const { cpf } = req.params;
      const user = await this.userService.getUserByCpf(cpf);
      res.status(200).json({
        message: 'Usuários encontrado com sucesso!',
        data: user,
      });
    } catch (error) {
      console.log(`getUserByCpf ERROR: ${error}`);
      return res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
  };
}
