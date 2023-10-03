import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class PriorityModel extends Model {
  static init(sequelize) {
    super.init(
      {
        idPriority: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'priority',
      },
    );
  }
}
PriorityModel.init(sequelizeConfig, Sequelize.DataTypes);
export default PriorityModel;
