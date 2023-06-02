import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class ProcessModel extends Model {
  static init(sequelize) {
    super.init(
      {
        record: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
        nickname: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        effectiveDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        idFlow: {
          type: DataTypes.INTEGER,
          foreignKey: true,
          allowNull: false,
        },
        idUnit: {
          type: DataTypes.INTEGER,
          foreignKey: true,
          allowNull: false,
        },
        idStage: {
          type: DataTypes.INTEGER,
          foreignKey: true,
          allowNull: false,
        },
        idPriority: {
          type: DataTypes.INTEGER,
          foreignKey: true,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM({
            values: ['inProgress', 'archived', 'finished', 'notStarted'],
          }),
          allowNull: false,
          defaultValue: 'notStarted',
        },
      },
      {
        sequelize,
        tableName: 'process',
      },
    );
  }
}
ProcessModel.init(sequelizeConfig, Sequelize.DataTypes);
export default ProcessModel;
