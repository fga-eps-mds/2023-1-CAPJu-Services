import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class StageModel extends Model {
  static init(sequelize) {
    super.init(
      {
        idStage: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allownull: false,
        },
        name: DataTypes.STRING(100),
        duration: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        idUnit: {
          type: DataTypes.INTEGER,
          foreignKey: true,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'stage',
      },
    );
  }
  static associate(models) {
    this.belongsToMany(models.Flow, {
      foreignKey: 'idStage',
      through: 'idFlowStage',
      as: 'flow',
    });
    this.hasMany(models.Process, { foreignKey: 'record', as: 'process' });
  }
}
StageModel.init(sequelizeConfig, Sequelize.DataTypes);
export default StageModel;
