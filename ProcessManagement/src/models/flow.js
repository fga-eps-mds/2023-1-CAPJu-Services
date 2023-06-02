import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class FlowModel extends Model {
  static init(sequelize) {
    super.init(
      {
        idFlow: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: DataTypes.STRING(100),
        idUnit: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'flow',
      },
    );
  }
  static associate(models) {
    this.belongsTo(models.Unit, { foreignKey: 'idUnit', as: 'unit' });
    this.belongsToMany(models.Stage, {
      foreignKey: 'idFlow',
      through: 'idFlowStage',
      as: 'stage',
    });
    this.belongsToMany(models.Process, {
      foreignKey: 'idFlow',
      through: 'idFlowProcess',
      as: 'process',
    });
    this.belongsToMany(models.User, {
      foreignKey: 'idFlow',
      through: 'idFlowUser',
      as: 'user',
    });
  }
}
FlowModel.init(sequelizeConfig, Sequelize.DataTypes);
export default FlowModel;
