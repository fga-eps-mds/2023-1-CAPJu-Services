import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class UnitModel extends Model {
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
        tableName: 'unit',
      },
    );
  }
}
UnitModel.init(sequelizeConfig, Sequelize.DataTypes);
export default UnitModel;
