import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class UserModel extends Model {
  static init(sequelize) {
    super.init(
      {
        cpf: {
          type: DataTypes.STRING(11),
          primaryKey: true,
        },
        fullName: {
          type: DataTypes.STRING(300),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(300),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(256),
          allowNull: false,
        },
        accepted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        idUnit: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        idRole: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'users',
      },
    );
  }
}
UserModel.init(sequelizeConfig, Sequelize.DataTypes);
export default UserModel;

