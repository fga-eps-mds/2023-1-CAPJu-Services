import services from '../services/_index.js';

export class RoleController {
  async index(_req, res) {
    try {
      const role = await services.roleService.findAll();

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
    const { idRole } = req.params;

    try {
      const role = await services.roleService.findOneById(idRole);
      if (!role) {
        return res.status(204).json([]);
      } else {
        return res.status(200).json(role);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async updateRole(req, res) {
    const params = req.body;
    const { idRole } = req.params;

    try {
      const role = await services.roleService.findOneById(idRole);
      if (!role || role === null) {
        return res.status(204).json([]);
      } else {
        await services.roleService.updateRole(params, idRole);
        return res.status(200).json(role);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async delete(req, res) {
    const { idRole } = req.params;

    try {
      const role = await services.roleService.findOneById(idRole);
      if (!role) {
        return res.status(404);
      } else {
        await services.roleService.deleteRoleById(idRole);
        return res.status(200).json(role);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async store(req, res) {
    const { name, accessLevel, allowedActions } = req.body;

    try {
      const role = await services.roleService.createRole({
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
