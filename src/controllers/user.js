import services from '../services/_index.js';
import { generateToken } from '../utils/jwt.js';
import { filterByFullName } from '../utils/filters.js';
import { Op } from 'sequelize';
import { hash, verify } from 'argon2';
import passHashing from '../config/passHashing.js';
import { cpfFilter } from '../utils/cpf.js';
import { userFromReq } from '../middleware/authMiddleware.js';

export class UserController {
  constructor() {
    this.userService = services.userService;
  }

  index = async (req, res) => {
    try {
      let where;
      const user = await userFromReq(req);
      const idUnit = user.unit.idUnit;
      const idRole = user.role.idRole;
      const unitFilter = idRole === 5 ? {} : { idUnit };
      where = {
        ...filterByFullName(req),
        ...unitFilter,
      };

      if (req.query.accepted) {
        const { accepted } = req.query;
        let users;
        let totalCount;
        let totalPages;
        if (accepted === 'true') {
          users = await this.userService.getAcceptedUsers({
            where: { accepted: true, idRole: { [Op.ne]: 5 }, ...where },
            offset: req.query.offset,
            limit: req.query.limit,
          });
          totalCount = await this.userService.countRows({
            // fazer o count
            where: { accepted: true, idRole: { [Op.ne]: 5 }, ...where },
          });
          totalPages = Math.ceil(totalCount / parseInt(req.query.limit, 10));
        } else if (accepted === 'false') {
          console.log('pega false');
          users = await this.userService.getNoAcceptedUsers({
            where: { accepted: false, idRole: { [Op.ne]: 5 }, ...where },
            offset: req.query.offset,
            limit: req.query.limit,
          });
          console.log(users);
          totalCount = await this.userService.countRows({
            // fazer o count
            where: { accepted: false, idRole: { [Op.ne]: 5 }, ...where },
          });
          totalPages = Math.ceil(totalCount / parseInt(req.query.limit, 10));
        } else {
          return res.status(400).json({
            message: "O parâmetro accepted deve ser 'true' ou 'false'",
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

        return res.status(200).json({ users: users || [], totalPages });
      } else {
        const users = await this.userService.getAllUsers({
          where: {
            idRole: { [Op.ne]: 5 },
            ...where,
          },
        });

        const mappedUsers = users.map(user => {
          return {
            cpf: user.cpf,
            fullName: user.fullName,
            email: user.email,
            accepted: user.accepted,
            idUnit: user.idUnit,
            idRole: user.idRole,
          };
        });

        return res.status(200).json({ users: mappedUsers || [] });
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

      const user = await this.userService.getUserByCpfWithPasswordRolesAndUnit(
        cpf,
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

      const isPasswordCorrect = await verify(
        user.password,
        password,
        passHashing,
      );

      if (isPasswordCorrect) {
        const tokenPayload = { ...user.toJSON() };
        delete tokenPayload.password;

        const jwtToken = generateToken(tokenPayload);

        let expiresIn = new Date();
        expiresIn.setDate(expiresIn.getDate() + 3);

        return res.status(200).json(jwtToken);
      } else {
        return res.status(401).json({
          error: 'Impossível autenticar',
          message: 'Senha ou usuário incorretos',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error, message: 'erro inesperado' });
    }
  };

  store = async (req, res) => {
    try {
      const { fullName, cpf, email, password, idUnit, idRole } = req.body;

      const hashedPassword = await hash(password, passHashing);

      const data = {
        fullName,
        cpf: cpfFilter(cpf),
        email,
        password: hashedPassword,
        accepted: false,
        idUnit,
        idRole,
      };

      const user = await this.userService.createUser(data);

      return res
        .json({ user, message: 'Usuario cadastrado com sucesso' })
        .status(200);
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

  updateUserFullName = async (req, res) => {
    try {
      const { cpf } = req.params;
      const { fullName } = req.body;
      const updated = await this.userService.updateUserFullName(cpf, fullName);
      if (updated) {
        return res.status(200).json({
          message: 'Nome completo atualizado',
        });
      } else {
        return res.status(400).json({
          message: 'Nome completo não atualizado',
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error, message: 'Erro ao atualizar o nome' });
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
