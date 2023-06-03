import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class FlowStageModel extends Model {
  static init(sequelize) {
    super.init(
      {
        idFlowStage: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        idStageA: {
          type: DataTypes.INTEGER,
          foreignKey: true,
          allownull: false,
        },
        idStageB: {
          type: DataTypes.INTEGER,
          foreignKey: true,
          allowNull: false,
        },
        idFlow: {
          type: DataTypes.INTEGER,
          foreignKey: true,
          allowNull: false,
        },
        commentary: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'flowStage',
      },
    );
  }
  static associate(models) {
    this.belongsToMany(models.Flow, {
      foreignKey: 'idFlow',
      through: 'idFlowStage',
      as: 'flow',
    });
    this.belongsToMany(models.Stage, {
      foreignKey: 'idStageA',
      through: 'idFlowStage',
      as: 'stageA',
    });
    this.belongsToMany(models.Stage, {
      foreignKey: 'idStageB',
      through: 'idFlowStage',
      as: 'stageB',
    });
  }
}
FlowStageModel.init(sequelizeConfig, Sequelize.DataTypes);
export default FlowStageModel;
