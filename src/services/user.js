import models from '../models/_index.js';

export class UserService {
  constructor() {
    this.repository = models.User;
    this.roleRepository = models.Role;
  }

  async findUserWithRole(cpf, attributes) {
    let userData = await this.repository.findOne({
      where: { cpf },
      attributes: [...(attributes || []), 'idRole'],
      raw: true,
    });

    if (!userData) return;

    const { idRole } = userData;

    const { allowedActions } = await this.roleRepository.findOne({
      where: { idRole },
      attributes: ['allowedActions'],
    });

    userData = { ...userData, role: { idRole, allowedActions } };

    return userData;
  }
}
