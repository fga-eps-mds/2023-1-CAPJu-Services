import models from '../models/index.js';
import UserService from '../services/user.js';

export class UserController {
  constructor() {
    this.userService = new UserService(models.User);
  }

  index = async (req, res) => {
    console.info('UserController => getAllUsers');
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({
        message: 'Usuários encontrados com sucesso!',
        data: users,
      });
    } catch (error) {
      console.error(`getAllUsers ERROR: ${error}`);
      return res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  };

  getUserByCpf = async (req, res) => {
    console.info('UserController => getUserByCpf');
    try {
      const { cpf } = req.params;
      const user = await this.userService.getUserByCpf(cpf);
      res.status(200).json({
        message: 'Usuários encontrado com sucesso!',
        data: user,
      });
    } catch (error) {
      console.error(`getUserByCpf ERROR: ${error}`);
      return res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
  };
}
