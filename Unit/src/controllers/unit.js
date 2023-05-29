import 'dotenv/config';
import axios from 'axios';
import models from '../models/index.js';
import UnitService from '../services/unit.js';

export class UnitController {
  constructor() {
    this.unitService = new UnitService(models.Unit);
  }

  getAllUnits = async (req, res) => {
    try {
      const units = await this.unitService.getAllUnits();
      if (!units) {
        return res.status(401).json({ message: 'Não Existe unidades' });
      } else {
        return res.status(200).json(units);
      }
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar unidades' });
    }

  }

  store = async (req, res) => {
    try {
      const { name } = req.body;
      const unit = await this.unitService.createUnit(name);
      return res.json(unit);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Erro ao criar unidade",
      });
    }
  }

  update = async (req, res) => {
    try {
      const { idUnit, name } = req.body;
      console.log("idUnit", idUnit, name)
      const updated = await this.unitService.updateUnit(idUnit, name);
      console.log("updated", updated)

      if (updated) {
        return res.status(200).json({
          message: 'Unidade atualizado com sucesso',
        });
      } else {
        return res.status(400).json({
          message: 'Unidade não atualizada',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error,
        message: 'Erro ao atualizar unidade',
      });
    }
  }

  delete = async (req, res) => {
    try {
      const { idUnit } = req.body;
      const unit = await this.unitService.getUnitById(idUnit);
      if (!unit) {
        return res.status(404).json({ error: 'Unidade não existe!' });
      } else {
        await unit.destroy();
        return res.status(200).json({
          message: 'Unidade apagada com sucesso',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error,
        message: 'Erro ao apagar unidade',
      });
    }
  }

  getAdminsByUnitId = async (req, res) => {
    try {
      const { idUnit } = req.params;
      const users_response = await axios.get(`${process.env.USER_URL_API}/admins/unit/${idUnit}`);
      if (users_response.data.length === 0) {
        return res.status(401).json({ message: 'Não existem usuários adminstradores nessa unidade' });
      } else {
        return res.status(200).json(users_response.data);
      }
    } catch (error) {
      console.log("error", error)
      return res.status(500).json({
        error: 'Erro ao buscar administradores',
      });
    }
  }
}
