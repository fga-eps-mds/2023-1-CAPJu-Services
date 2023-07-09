import 'dotenv/config';
import axios from 'axios';
import services from '../services/_index.js';
import { ROLE } from '../schemas/role.js';
import { filterByName } from '../utils/filters.js';

export class UnitController {
  constructor() {
    this.unitService = services.unitService;
  }

  index = async (req, res) => {
    try {
      const { offset, limit } = req.query;
      const where = {
        ...filterByName(req),
      };
      const units = await this.unitService.getAllUnits(where, offset, limit);
      const totalCount = await this.unitService.countRows({ where });
      const totalPages = Math.ceil(totalCount / parseInt(req.query.limit, 10));
      return res.status(200).json({ units: units || [], totalPages });
    } catch (error) {
      return res.status(500).json({
        error,
        message: 'Erro ao listar unidades',
      });
    }
  };

  store = async (req, res) => {
    try {
      const { name } = req.body;
      const unit = await this.unitService.createUnit(name);
      return res.status(200).json(unit);
    } catch (error) {
      return res.status(500).json({
        error,
        message: 'Erro ao criar unidade',
      });
    }
  };

  update = async (req, res) => {
    try {
      const { idUnit, name } = req.body;
      const updated = await this.unitService.updateUnit(idUnit, name);
      if (updated) {
        return res.status(200).json({
          message: 'Unidade atualizado com sucesso',
        });
      } else {
        return res.status(404).json({
          message: 'Essa unidade não existe!',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error,
        message: 'Erro ao atualizar unidade',
      });
    }
  };

  delete = async (req, res) => {
    try {
      const { idUnit } = req.body;
      const unit = await this.unitService.getUnitById(idUnit);

      if (!unit) {
        return res.status(204).json({ error: 'Essa unidade não existe!' });
      }
      const users_response = await axios.get(
        `${process.env.USER_URL_API}/admins/unit/${idUnit}`,
      );

      if (users_response?.data?.length > 0) {
        return res.status(409).json({
          error: 'Há usuários na unidade',
          message: `Há ${users_response.data.length} usuários nesta unidade.`,
        });
      }
      await unit.destroy();
      return res.status(200).json({
        message: 'Unidade apagada com sucesso',
      });
    } catch (error) {
      return res.status(500).json({
        error,
        message: 'Erro ao apagar unidade',
      });
    }
  };

  showAdminsByUnitId = async (req, res) => {
    try {
      const { idUnit } = req.params;
      const users_response = await axios.get(
        `${process.env.USER_URL_API}/admins/unit/${idUnit}`,
      );

      if (users_response.data.length === 0) {
        return res
          .status(204)
          .json({ error: 'Não há administradores para essa unidade' });
      } else {
        return res.status(200).json(users_response.data);
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao buscar administradores',
      });
    }
  };

  setUnitAdmin = async (req, res) => {
    try {
      const { idUnit, cpf } = req.body;
      const userAdmin = await axios.get(
        `${process.env.USER_URL_API}/user/${cpf}/unit/${idUnit}`,
      );
      if (!userAdmin.data) {
        return res.status(404).json({
          message: `Usuário aceito não existe nesta unidade`,
        });
      } else {
        const postData = {
          idRole: ROLE.ADMINISTRADOR,
          cpf: cpf,
        };
        await axios.put(`${process.env.USER_URL_API}/updateUserRole`, postData);
        const userUpdated = await axios.get(
          `${process.env.USER_URL_API}/cpf/${cpf}`,
        );
        return res.status(200).json(userUpdated.data);
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao configurar usuário como administrador',
      });
    }
  };

  removeUnitAdmin = async (req, res) => {
    const { idUnit, cpf } = req.body;
    try {
      const userAdmin = await axios.get(
        `${process.env.USER_URL_API}/user/${cpf}/unit/${idUnit}`,
      );
      if (!userAdmin.data) {
        return res.status(404).json({
          error: 'Usuário não existe nesta unidade',
        });
      } else {
        const postData = {
          idRole: ROLE.JUIZ,
          cpf: cpf,
        };
        await axios.put(`${process.env.USER_URL_API}/updateUserRole`, postData);
        const userUpdated = await axios.get(
          `${process.env.USER_URL_API}/cpf/${cpf}`,
        );
        return res.status(200).json(userUpdated.data);
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao remover usuário como administrador',
      });
    }
  };
}
