import {Model, DataTypes, Sequelize} from "sequelize";
import sequelizeConfig from "../config/sequelize.js";

class Unit extends Model {
  static init(sequelize) {
    super.init(
      {
        idUnit: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "unit",
      }
    );
  }

  static associate(models) {
    this.hasMany(models.User, {
      foreignKey: "cpf",
      as: "users",
    });
    this.hasMany(models.Flow, {
      foreignKey: "idFlow",
      as: "flow",
    });
    this.hasMany(models.Process, {
      foreignKey: "record",
      as: "procs",
    });
  }
}

Unit.init(sequelizeConfig, Sequelize.DataTypes);
export default Unit;
