import services from '../services/_index.js';
import { generateToken } from '../utils/jwt.js';

export class UserController {
  constructor() {
    this.userService = services.userService;
  }

  index = async (req, res) => {
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
            message: "Parâmetro accepted deve ser 'true' ou 'false'",
          });
        }
        return res.status(200).json(users);
      } else {
        users = await this.userService.getAllUsers();
        return res.status(200).json(users);
      }
    } catch (error) {
      return res.status(500).json({
        error,
        message: 'Erro ao listar usuários aceitos ou não',
      });
    }
  };

  indexUsersAdminByUnitId = async (req, res) => {
    try {
      const { idUnit } = req.params;
      const usersRaw = await this.userService.getUsersAdminByIdUnit(idUnit);
      if (!usersRaw) {
        return res.status(404).json({ error: 'Usuários não existem' });
      }
      return res.status(200).json(usersRaw);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  };

  showUserByCpf = async (req, res) => {
    try {
      const { cpf } = req.params;
      const userRaw = await this.userService.getUserByCpf(cpf);
      if (!userRaw) {
        return res.status(404).json({ error: 'Usuário não existe' });
      }
      return res.status(200).json(userRaw);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
  };

  showUserByUnit = async (req, res) => {
    try {
      const { cpf, idUnit } = req.params;
      const user = await this.userService.getUserByUnit(cpf, Number(idUnit));
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
  };

  loginUser = async (req, res) => {
    try {
      const { cpf, password } = req.body;
      const user = await this.userService.getUserByCpfWithPassword(cpf);
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
      return res.status(500).json({ error, message: 'erro inesperado' });
    }
  };

  store = async (req, res) => {
    try {
      const { fullName, cpf, email, password, idUnit, idRole } = req.body;
      const data = {
        fullName,
        cpf,
        email,
        password,
        accepted: false,
        idUnit,
        idRole,
      };
      const user = await this.userService.createUser(data);
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error, message: 'Erro ao criar usuário' });
    }
  };

  deleteByCpf = async (req, res) => {
    try {
      const { cpf } = req.params;
      const user = await this.userService.getAcceptedUserByCpf(cpf);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não existe!' });
      } else {
        await user.destroy();
        return res.status(200).json({
          message: 'Usuário apagado com sucesso',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error,
        message: 'Erro ao apagar usuário',
      });
    }
  };

  updateUserEmail = async (req, res) => {
    try {
      const { cpf } = req.params;
      const { email } = req.body;
      const updated = await this.userService.updateUserEmail(cpf, email);
      if (updated) {
        return res.status(200).json({
          message: 'Email atualizado com sucesso',
        });
      } else {
        return res.status(400).json({
          message: 'Email não atualizado',
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error, message: 'Erro ao atualizar email' });
    }
  };

  updateUserRole = async (req, res) => {
    try {
      const { idRole, cpf } = req.body;
      const updated = await this.userService.updateUserRole(cpf, idRole);
      if (updated) {
        return res.status(200).json({
          message: 'Role atualizado com sucesso',
        });
      } else {
        return res.status(400).json({
          message: 'Role não atualizada',
        });
      }
    } catch (error) {
      return res.status(500).json({ error, message: 'Erro ao atualizar role' });
    }
  };

  updateUserPassword = async (req, res) => {
    try {
      const { cpf } = req.params;
      const { oldPassword, newPassword } = req.body;
      const updated = await this.userService.updateUserPassword(
        cpf,
        oldPassword,
        newPassword,
      );
      if (updated) {
        return res.status(200).json({
          message: 'Senha atualizada com sucesso',
        });
      } else {
        return res.status(400).json({
          message: 'Senha não atualizada!',
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error, message: 'Erro ao atualizar senha' });
    }
  };

  acceptRequest = async (req, res) => {
    try {
      const { cpf } = req.params;
      const user = await this.userService.getUserByCpf(cpf);
      if (!user) {
        res.status(404).json({ error: 'Usuário não existe' });
      } else {
        user.set({ accepted: true });
        await user.save();
        return res.status(200).json({
          message: 'Usuário aceito com sucesso',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error,
        message: 'Falha ao aceitar usuário',
      });
    }
  };

  deleteRequest = async (req, res) => {
    try {
      const { cpf } = req.params;
      const user = await this.userService.getNoAcceptedUserByCpf(cpf);

      if (!user) {
        res.status(404).json({ error: 'Usuário não existe' });
      } else {
        await user.destroy();
        return res.status(200).json({
          message: 'Usuário não aceito foi excluído',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error,
        message: 'Erro ao negar pedido do usuário',
      });
    }
  };
}
