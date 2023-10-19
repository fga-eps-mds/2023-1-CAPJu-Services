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
        idFlow: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          foreignKey: true,
          allowNull: false,
        },
        nickname: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        finalised: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        effectiveDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        idUnit: {
          type: DataTypes.INTEGER,
          foreignKey: true,
          allowNull: false,
        },
        idStage: {
          type: DataTypes.INTEGER,
          foreignKey: true,
          allowNull: true,
          defaultValue: null,
        },
        idPriority: {
          type: DataTypes.INTEGER,
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
  static associate(models) {
    this.belongsTo(models.Priority, {
      foreignKey: 'idPriority',
      as: 'processPriority',
    });
    this.belongsTo(models.Stage, { foreignKey: 'idStage', as: 'processStage' });
    this.belongsToMany(models.Flow, {
      foreignKey: 'record',
      through: 'idFlowProcess',
      as: 'process',
    });
  }
}
ProcessModel.init(sequelizeConfig, Sequelize.DataTypes);
export default ProcessModel;
