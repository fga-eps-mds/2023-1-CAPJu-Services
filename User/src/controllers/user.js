import models from '../models/index.js';
import UserService from '../services/user.js';
import { cpfFilter } from '../utils/cpf.js';
import { generateToken } from '../utils/jwt.js';

export class UserController {
  constructor() {
    this.userService = new UserService(models.User);
  }

  getUserByCpf = async (req, res) => {
    console.info('UserController => getUserByCpf');
    try {
      const { cpf } = req.params;
      const userRaw = await this.userService.getUserByCpf(cpf);
      if (!userRaw) {
        return res.status(404).json({ error: 'Usuário não existe' });
      }
      return res.status(200).json(userRaw);
    } catch (error) {
      console.error(`getUserByCpf ERROR: ${error}`);
      return res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
  };

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
        return res.status(200).json(users);
      } else {
        users = await this.userService.getAllUsers();
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

  loginUser = async (req, res) => {
    console.info('UserController => loginUser');
    try {
      const { cpf, password } = req.body;
      // Check for user cpf
      const user = await this.userService.getUserByCpfWithPassword(
        cpfFilter(cpf),
      );
      if (!user) {
        return res.status(401).json({
          error: 'Usuário inexistente',
          message: 'Usuário inexistente',
        });
      }
      if (!user.accepted) {
        return res.status(401).json({
          message: 'Usuário não aceito',
        });
      }
      if (user.password === password) {
        let expiresIn = new Date();
        expiresIn.setDate(expiresIn.getDate() + 3);
        return res.status(200).json({
          cpf: user.cpf,
          fullName: user.fullName,
          email: user.email,
          idUnit: user.idUnit,
          token: generateToken(user.cpf),
          idRole: user.idRole,
          expiresIn,
        });
      } else {
        return res.status(401).json({
          error: 'Impossível autenticar',
          message: 'Senha ou usuário incorretos',
        });
      }
    } catch (error) {
      console.error(`loginUser ERROR: ${error}`);
      return res.status(500).json({ error, message: 'erro inesperado' });
    }
  };

  store = async (req, res) => {
    console.info('UserController => createUser');
    try {
      const { fullName, cpf, email, password, idUnit, idRole } = req.body;
      const data = {
        fullName,
        cpf: cpfFilter(cpf),
        email,
        password,
        accepted: false,
        idUnit,
        idRole,
      };
      const user = await this.userService.createUser(data);
      return res.json(user);
    } catch (error) {
      console.error(`createUser ERROR: ${error}`);
      return res.status(500).json({ error, message: 'Erro ao criar usuário' });
    }
  };
}
