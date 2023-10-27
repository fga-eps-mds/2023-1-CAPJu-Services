import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class RoleModel extends Model {
  static init(sequelize) {
    super.init(
      {
        idRole: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allownull: false,
        },
        accessLevel: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        allowedActions: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'role',
      },
    );
  }

  static associate(models) {
    this.hasMany(models.User, {
      foreignKey: 'cpf',
      as: 'users',
    });
  }
}

RoleModel.init(sequelizeConfig, Sequelize.DataTypes);
export default RoleModel;
