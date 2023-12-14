import { cpfFilter } from '../utils/cpf.js';
import Unit from '../models/unit.js';
import Role from '../models/role.js';
import passHashing from '../config/passHashing.js';
import { hash, verify } from 'argon2';

class UserService {
  constructor(UserModel) {
    this.user = UserModel;
  }

  async countRows({ where }) {
    return this.user.count({ where });
  }

  async getAllUsers() {
    return this.user.findAll({
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getAcceptedUsers(data) {
    return this.user.findAll({
      where: { ...data.where, accepted: true },
      offset: data.offset,
      limit: data.limit,
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getNoAcceptedUserByCpf(cpf) {
    return this.user.findOne({
      where: { accepted: false, cpf: cpfFilter(cpf) },
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getAcceptedUserByCpf(cpf) {
    return this.user.findOne({
      where: { accepted: true, cpf: cpfFilter(cpf) },
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getAcceptedUserByUnitAndCpf(idUnit, cpf) {
    return this.user.findOne({
      where: { accepted: true, idUnit: idUnit, cpf: cpfFilter(cpf) },
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getNoAcceptedUsers(data) {
    return this.user.findAll({
      where: { ...data.where, accepted: false },
      offset: data.offset,
      limit: data.limit,
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getUserByCpf(cpf) {
    return this.user.findOne({
      where: { cpf: cpfFilter(cpf) },
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getUsersAdminByIdUnit(idUnit) {
    return this.user.findAll({
      where: {
        idUnit: idUnit,
        idRole: 5,
      },
    });
  }

  async getUserByUnit(cpf, idUnit) {
    return this.user.findOne({
      where: {
        cpf: cpf,
        idUnit: idUnit,
      },
    });
  }

  async getUserByCpfWithPassword(cpf) {
    return this.user.findOne({
      where: { cpf: cpfFilter(cpf) },
    });
  }

  async createUser(data) {
    return this.user.create(data);
  }

  async updateUserEmail(cpf, email) {
    const user = await this.getUserByCpf(cpf);

    if (user) {
      const [updatedRows] = await this.user.update(
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
      const [updatedRows] = await this.user.update(
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
      const [updatedRows] = await this.user.update(
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
        const [updatedRows] = await this.user.update(
          { password: hashedPassword },
          { where: { cpf: cpfFilter(cpf) } },
        );
        if (updatedRows) return true;
      }
    }
    return false;
  }
  async getUserByCpfWithPasswordRolesAndUnit(cpf) {
    return this.user.findOne({
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
}

export default UserService;
