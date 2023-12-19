import services from '../services/_index.js';
import { generateToken } from '../utils/jwt.js';
import { filterByFullName } from '../utils/filters.js';
import { Op } from 'sequelize';
import { hash, verify } from 'argon2';
import passHashing from '../config/passHashing.js';
import { cpfFilter } from '../utils/cpf.js';
import { userFromReq } from '../../middleware/authMiddleware.js';
import requestIp from 'request-ip';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import moment from 'moment-timezone';

export class UserController {
  constructor() {
    this.userService = services.userService;
    this.userAccessLogService = services.userAccessLogService;
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
            where: { accepted: true, idRole: { [Op.ne]: 5 }, ...where },
          });
          totalPages = Math.ceil(totalCount / parseInt(req.query.limit, 10));
        } else if (accepted === 'false') {
          users = await this.userService.getNoAcceptedUsers({
            where: { accepted: false, idRole: { [Op.ne]: 5 }, ...where },
            offset: req.query.offset,
            limit: req.query.limit,
          });
          totalCount = await this.userService.countRows({
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
      const { cpf: userCPF, password } = req.body;

      const user = await this.userService.getUserByCpfWithPasswordRolesAndUnit(
        userCPF,
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
        let sessionId;

        do {
          sessionId = uuidv4();
        } while (await this.userAccessLogService.isSessionIdPresent(sessionId));

        const tokenPayload = { ...user.toJSON(), sessionId };
        delete tokenPayload.password;

        const jwtToken = generateToken(tokenPayload);

        await this.userAccessLogService.renewAndCreateSession({
          stationIp: requestIp.getClientIp(req),
          jwtToken,
          sessionId,
          userCPF: user.cpf,
        });

        return res.status(200).json(jwtToken);
      } else {
        return res.status(401).json({
          error: 'Impossível autenticar',
          message: 'Credenciais inválidas',
        });
      }
    } catch (error) {
      return res.status(500).json({ error, message: 'Erro inesperado' });
    }
  };

  logoutUser = async (req, res) => {
    try {
      const tokenResult = await this.verifyToken(req);
      if (tokenResult.error) {
        return res.status(401).json({ message: tokenResult.message });
      }

      const { cpf: userCPF } = await userFromReq(req);

      const { logoutInitiator } = req.params;

      await this.userAccessLogService.update(
        {
          logoutTimestamp: moment().tz('America/Sao_Paulo'),
          logoutInitiator,
        },
        {
          where: {
            userCPF,
            logoutTimestamp: null,
          },
        },
      );

      return res.json({ message: 'Logout realizado com sucesso' }).status(200);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error, message: 'Erro ao realizar logout' });
    }
  };

  checkPasswordValidity = async (req, res) => {
    try {
      const { cpf: userCPF, password } = req.body;

      const user = await this.userService.getUserByCpfWithPasswordRolesAndUnit(
        userCPF,
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
        return res.status(200).json({});
      } else {
        return res.status(401).json({
          error: 'Impossível autenticar',
          message: 'Credenciais inválidas',
        });
      }
    } catch (error) {
      return res.status(500).json({ error, message: 'Erro inesperado' });
    }
  };

  logoutExpiredSession = async (req, res) => {
    try {
      const tokenResult = await this.verifyToken(req);
      if (tokenResult.error) {
        return res.status(401).json({ message: tokenResult.message });
      }

      const { sessionId } = await userFromReq(req);

      await this.userAccessLogService.update(
        {
          logoutTimestamp: moment().tz('America/Sao_Paulo'),
          logoutInitiator: 'tokenExpired',
        },
        {
          where: {
            sessionId,
          },
        },
      );

      return res.status(200).json({});
    } catch (error) {
      return res
        .status(500)
        .json({ error, message: 'Erro ao realizar logout' });
    }
  };

  logoutAsAdmin = async (req, res) => {
    try {
      const { sessionId } = req.params;

      await this.userAccessLogService.update(
        {
          logoutTimestamp: moment().tz('America/Sao_Paulo'),
          logoutInitiator: 'adminInitiated',
        },
        {
          where: {
            sessionId,
          },
        },
      );

      return res
        .json({ message: 'Usuário deslogado com sucesso!' })
        .status(200);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error, message: 'Erro ao realizar logout' });
    }
  };

  getSessionStatus = async (req, res) => {
    try {
      const tokenResult = await this.verifyToken(req);
      if (tokenResult.error) {
        return res.status(401).json({ message: tokenResult.message });
      }

      const { sessionId } = req.params;

      return res
        .json({
          ...(await this.userAccessLogService.isSessionActive(sessionId)),
        })
        .status(200);
    } catch (error) {
      return res
        .status(500)
        .json({ error, message: 'Erro ao realizar logout' });
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

  requestPasswordRecovery = async (req, res) => {
    try {
      await this.userService.requestPasswordRecovery(req);

      return res.json({}).status(200);
    } catch (error) {
      const status = error.status || 500;
      const message =
        error.message || 'Erro ao requisitar a recuperação de senha.';
      return res.status(status).json({ error: message });
    }
  };

  checkPasswordRecoveryToken = async (req, res) => {
    try {
      const { token } = req.params;
      await this.userService.checkPasswordRecoveryToken(token);
      return res.json({}).status(200);
    } catch (error) {
      const status = error.status || 500;
      const message =
        error.message || 'Erro ao verificar token de recuperação de senha.';
      return res.status(status).json({ error: message });
    }
  };

  updatePasswordFromRecoveryToken = async (req, res) => {
    try {
      const { token, password } = req.body;
      await this.userService.updatePasswordFromRecoveryToken(token, password);
      return res.json({}).status(200);
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Erro ao atualizar senha.';
      return res.status(status).json({ error: message });
    }
  };

  verifyToken = async req => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
      return { error: true, message: 'Nenhum token fornecido!' };
    }

    const token = authorizationHeader.split(' ')[1];

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return { error: false };
    } catch (error) {
      if (error.name !== 'TokenExpiredError') {
        return { error: true, message: 'Autenticação falhou!' };
      }
      return { error: true, tokenExpired: true };
    }
  };
}
