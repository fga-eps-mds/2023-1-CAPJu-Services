import models from '../models/index.js';
import UserService from '../services/user.js';

export class UserController {
  constructor() {
    this.userService = new UserService(models.User);
  }

  getAllUsers = async (req, res) => {
    console.info('UserController => getAllUsers');
    try {
      const { accepted } = req.query;
      let users = [];
      if (accepted) {
        if (accepted === 'true') {
          users = await this.userService.getAcceptedUsers();
        } else if (accepted === 'false') {
          users = await this.userService.getNoAcceptedUsers();
        } else {
          return res.status(400).json({
            message: 'Parâmetro accepted deve ser \'true\' ou \'false\'',
          });
        }
        users = users.map(user => {
          return {
            cpf: user.cpf,
            fullName: user.fullName,
            email: user.email,
            accepted: user.accepted,
            idUnit: user.idUnit,
            idRole: user.idRole,
          };
        });
        return res.status(200).json(users);
      } else {
        users = await this.userService.getAllUsers();
        users = users.map(user => {
          return {
            cpf: user.cpf,
            fullName: user.fullName,
            email: user.email,
            accepted: user.accepted,
            idUnit: user.idUnit,
            idRole: user.idRole,
          };
        });
        return res.status(200).json(users);
      }
    } catch (error) {
      console.error(`getAllUsers ERROR: ${error}`);
      return res.status(500).json({
        error,
        message: 'Erro ao listar usuários aceitos ou não',
      });
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
