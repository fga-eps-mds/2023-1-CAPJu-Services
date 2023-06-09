import services from '../services/_index.js';

export class RoleController {
  constructor() {
    this.roleService = services.roleService;
  }

  async index(_req, res) {
    try {
      const role = await this.roleService.findAll();

      if (!role) {
        return res.status(204).json({ message: 'Não Existe cargo' });
      } else {
        return res.status(200).json(role);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async getById(req, res) {
    const idRole = req.params.id;

    try {
      const role = await this.roleService.findOneById(idRole);
      if (!role) {
        return res.status(204).json([]);
      } else {
        return res.status(200).json(role);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async updateRoleName(req, res) {
    const { name, idRole } = req.body;

    try {
      const role = await this.roleService.findOneById(idRole);
      if (!role || role === null) {
        return res.status(204).json([]);
      } else {
        await this.roleService.updateRoleName(
          name,
          role.allowedActions,
          idRole,
        );
        return res.status(200).json(role);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async updateRoleAllowedActions(req, res) {
    const { allowedActions } = req.body;
    const { idRole } = req.params;

    try {
      const role = await this.roleService.findOneById(idRole);
      if (!role || role === null) {
        return res.status(204).json([]);
      } else {
        await this.roleService.updateRoleName(
          role.name,
          allowedActions,
          idRole,
        );
        return res.status(200).json(role);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async delete(req, res) {
    const { idRole } = req.body;

    try {
      const role = await this.roleService.findOneById(idRole);
      if (!role) {
        return res.status(404);
      } else {
        await this.roleService.deleteNoteById(idRole);
        return res.status(200).json(role);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async store(req, res) {
    const { name, accessLevel, allowedActions } = req.body;

    try {
      const role = await this.roleService.createRole({
        name,
        accessLevel,
        allowedActions,
      });
      return res.status(200).json(role);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
