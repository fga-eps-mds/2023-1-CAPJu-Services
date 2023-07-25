class RoleService {
  constructor(RoleModel) {
    this.role = RoleModel;
  }

  async createRole(note) {
    return this.role.create(note);
  }

  async findAll() {
    return this.role.findAll();
  }

  async findOneById(idRole) {
    return this.role.findOne({
      where: { idRole },
    });
  }

  async deleteRoleById(idRole) {
    return await this.role.destroy({ where: { idRole } });
  }

  async updateRole(params, idRole) {
    const [updatedRows] = await this.role.update(
      params,
      { where: { idRole } },
    );
    if (updatedRows) {
      const updatedRole = await this.findOneById(idRole);
      return updatedRole;
    } else {
      return false;
    }
  }
}

export default RoleService;
