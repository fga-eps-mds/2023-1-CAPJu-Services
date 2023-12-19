import { cpfFilter } from '../utils/cpf.js';
import Unit from '../models/unit.js';
import Role from '../models/role.js';
import passHashing from '../config/passHashing.js';
import { hash, verify } from 'argon2';
import PasswordResetModel from '../models/passwordReset.js';
import { randomBytes } from 'crypto';
import { Op } from 'sequelize';
import { emailParams } from '../config/emailParams.js';
import * as nodemailer from 'nodemailer';
import { generatePasswordResetEmail } from '../utils/passwordRecoveryEmailTemplate.js';
import { capju, justicaFederal, unb } from '../../assets/logos.js';
import sequelizeConfig from '../config/sequelize.js';

class UserService {
  constructor(UserModel) {
    this.repository = UserModel;
    this.passwordResetRepository = PasswordResetModel;
  }

  async countRows({ where }) {
    return this.repository.count({ where });
  }

  async getAllUsers() {
    return this.repository.findAll({
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getAcceptedUsers(data) {
    return this.repository.findAll({
      where: { ...data.where, accepted: true },
      offset: data.offset,
      limit: data.limit,
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getNoAcceptedUserByCpf(cpf) {
    return this.repository.findOne({
      where: { accepted: false, cpf: cpfFilter(cpf) },
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getAcceptedUserByCpf(cpf) {
    return this.repository.findOne({
      where: { accepted: true, cpf: cpfFilter(cpf) },
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getAcceptedUserByUnitAndCpf(idUnit, cpf) {
    return this.repository.findOne({
      where: { accepted: true, idUnit: idUnit, cpf: cpfFilter(cpf) },
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getNoAcceptedUsers(data) {
    return this.repository.findAll({
      where: { ...data.where, accepted: false },
      offset: data.offset,
      limit: data.limit,
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getUserByCpf(cpf) {
    return this.repository.findOne({
      where: { cpf: cpfFilter(cpf) },
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getUsersAdminByIdUnit(idUnit) {
    return this.repository.findAll({
      where: {
        idUnit: idUnit,
        idRole: 5,
      },
    });
  }

  async getUserByUnit(cpf, idUnit) {
    return this.repository.findOne({
      where: {
        cpf: cpf,
        idUnit: idUnit,
      },
    });
  }

  async getUserByCpfWithPassword(cpf) {
    return this.repository.findOne({
      where: { cpf: cpfFilter(cpf) },
    });
  }

  async createUser(data) {
    return this.repository.create(data);
  }

  async updateUserEmail(cpf, email) {
    const user = await this.getUserByCpf(cpf);

    if (user) {
      const [updatedRows] = await this.repository.update(
        { email: email },
        { where: { cpf: cpfFilter(cpf) } },
      );
      if (updatedRows) return true;
    }
    return false;
  }

  async updateUserFullName(cpf, fullName) {
    const user = await this.getUserByCpf(cpf);
    if (user) {
      const [updatedRows] = await this.repository.update(
        { fullName: fullName },
        { where: { cpf: cpfFilter(cpf) } },
      );
      if (updatedRows) return true;
    }
    return false;
  }

  async updateUserRole(cpf, idRole) {
    const user = await this.getUserByCpf(cpf);
    if (user) {
      const [updatedRows] = await this.repository.update(
        { idRole: idRole },
        { where: { cpf: cpfFilter(cpf) } },
      );
      if (updatedRows) return true;
    }
    return false;
  }

  async updateUserPassword(cpf, oldPassword, newPassword) {
    const user = await this.getUserByCpfWithPassword(cpf);
    if (user) {
      const isPasswordCorrect = await verify(
        user.password,
        oldPassword,
        passHashing,
      );
      if (isPasswordCorrect) {
        const hashedPassword = await hash(newPassword, passHashing);
        const [updatedRows] = await this.repository.update(
          { password: hashedPassword },
          { where: { cpf: cpfFilter(cpf) } },
        );
        if (updatedRows) return true;
      }
    }
    return false;
  }

  async getUserByCpfWithPasswordRolesAndUnit(cpf) {
    return this.repository.findOne({
      where: { cpf: cpfFilter(cpf) },
      attributes: [
        'cpf',
        'fullName',
        'email',
        'password',
        'accepted',
        'idRole',
      ],

      include: [
        {
          model: Unit,
          as: 'unit',
          attributes: ['idUnit', 'name'],
        },
        {
          model: Role,
          as: 'role',
          attributes: ['idRole', 'name', 'accessLevel', 'allowedActions'],
        },
      ],
    });
  }

  async requestPasswordRecovery(req) {
    const { email, baseUrl } = req.body;

    const user = await this.repository.findOne({
      where: { email },
    });

    if (!user) {
      throw {
        status: 404,
        message: 'Usuário não encontrado.',
      };
    }

    if (!user.accepted) {
      throw {
        status: 404,
        message: 'Usuário ainda não aprovado. Consulte o administrador.',
      };
    }

    const userCPF = user.cpf;

    const currentPasswordResetRequest =
      await this.passwordResetRepository.findOne({
        where: {
          userCPF,
          expiresAt: {
            [Op.gte]: new Date(),
          },
        },
      });

    if (currentPasswordResetRequest) {
      throw {
        status: 409,
        message:
          'Já há uma solicitação de recuperação pendente para este usuário. Aguarde alguns minutos e tente novamente.',
      };
    }

    let token;
    do {
      token = randomBytes(24).toString('hex');
    } while (
      await this.passwordResetRepository.findOne({
        where: { token },
        logging: false,
        attributes: ['id'],
        raw: true,
      })
    );

    const transport = nodemailer.createTransport({
      ...emailParams,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const message = {
      from: emailParams.auth.user,
      to: email,
      subject: 'CAPJu - Recuperação de senha',
      html: generatePasswordResetEmail(baseUrl, token),
      attachments: [
        {
          filename: 'logoCapju.png',
          content: capju.split('base64,')[1],
          encoding: 'base64',
          cid: 'logoCapju',
        },
        {
          filename: 'logoUnb.png',
          content: unb.split('base64,')[1],
          encoding: 'base64',
          cid: 'logoUnb',
        },
        {
          filename: 'logoJusticaFederal.png',
          content: justicaFederal.split('base64,')[1],
          encoding: 'base64',
          cid: 'logoJusticaFederal',
        },
      ],
    };

    try {
      await transport.sendMail(message);

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      await this.passwordResetRepository.create(
        {
          expiresAt,
          userCPF,
          token,
        },
        {
          returning: false,
          logging: false,
        },
      );
    } catch (error) {
      throw {
        message:
          'Erro ao enviar email de recuperação. Contate o administrador e tente novamente mais tarde.',
      };
    }
  }

  async checkPasswordRecoveryToken(token) {
    const resetRequest = await this.passwordResetRepository.findOne({
      where: {
        token,
      },
      logging: false,
      raw: true,
    });

    const status = 400;

    if (!resetRequest) {
      throw {
        status,
        message: 'Token de recuperação de senha inválido!',
      };
    }

    if (new Date(resetRequest.expiresAt).getTime() <= new Date().getTime()) {
      throw {
        status,
        message:
          'Token de recuperação de senha expirado. Realize uma nova solicitação.',
      };
    }

    return resetRequest;
  }

  async updatePasswordFromRecoveryToken(token, newPassword) {
    const resetRequest = await this.checkPasswordRecoveryToken(token);
    const { userCPF: cpf } = resetRequest;
    const user = await this.repository.findOne({
      where: { cpf },
      attributes: ['accepted', 'password'],
      logging: false,
      raw: true,
    });

    if (!user.accepted) {
      throw {
        status: 400,
        message: 'Usuário ainda não aceito. Contate o administrador.',
      };
    }
    const isNewPasswordEqualCurrent = await verify(
      user.password,
      newPassword,
      passHashing,
    );
    if (isNewPasswordEqualCurrent) {
      throw {
        status: 400,
        message: 'Nova senha deve ser diferente da anterior.',
      };
    }
    if (!this.isPasswordSecure(newPassword)) {
      throw {
        status: 400,
        message: 'A senha não atende aos critérios de segurança necessários.',
      };
    }

    const newPasswordHash = await hash(newPassword, passHashing);
    await sequelizeConfig.transaction(async transaction => {
      await this.repository.update(
        { password: newPasswordHash },
        { where: { cpf } },
        { transaction },
      );
      await this.passwordResetRepository.update(
        { expiresAt: new Date() },
        { where: { token } },
        { transaction },
      );
    });
  }

  isPasswordSecure(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z$*&@#]{6,}$/;
    return regex.test(password);
  }
}

export default UserService;
