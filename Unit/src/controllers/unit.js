import Unit from "../models/unit.js";
import axios from "axios";
import { ROLE } from "../schemas/role.js";
import { config } from "dotenv";

config()

const user_api = process.env.API_URL_USER

class UnitController {
  async index(req, res) {
    const units = await Unit.findAll();

    if (!units) {
      return res.status(401).json({ message: "Não Existe unidades" });
    } else {
      return res.status(200).json(units);
    }
  }

  async store(req, res) {
    const { name } = req.body;
    try {
      const unit = await Unit.create({
        name,
      });
      return res.json(unit);
    } catch (error) {
      return res.status(500).json({
        error,
        message: "Erro ao criar unidade",
      });
    }
  }

  async update(req, res) {
    const { idUnit, name } = req.body;

    try {
      const unit = await Unit.findByPk(idUnit);

      if (!unit) {
        return res.status(404).json({ message: "Essa unidade não existe!" });
      }

      unit.name = name;
      await unit.save();

      return res.status(200).json(unit);
    } catch (error) {
      return res.status(500).json({
        error,
        message: "Erro ao atualizar unidade",
      });
    }
  }

  async delete(req, res) {
    const { idUnit } = req.body;

    const unit = await Unit.findByPk(idUnit);

    if (!unit) {
      return res.status(401).json({ error: "Essa unidade não existe!" });
    } else {
      await unit.destroy();
      return res.status(200).json(unit);
    }
  }

  async getAdminsByUnitId(req, res) {
    const idUnit = req.params.id;

    try {
      const users_response = await axios.get(user_api + '/users', {
        params: {
          idUnit,
          idRole: ROLE.DIRETOR,
        },
      });
      const user = JSON.parse(users_response.data);

      if (user.length === 0) {
        return res
          .status(404)
          .json({ error: "Não há administradores para essa unidade" });
      } else {
        return res.status(200).json(user);
      }
    } catch (error) {
      return res.status(500).json({
        error: "Erro ao buscar administradores",
      });
    }
  }
}

export default new UnitController();
