import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class ProcessModel extends Model {
  static init(sequelize) {
        super.init(
            {
                idProcess: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                record: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    unique: 'unique_processRecord_idStage'
                },
                idFlow: {
                    type: DataTypes.INTEGER,
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
                    allowNull: true,
                    unique: 'unique_processRecord_idStage'
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
                indexes: [
                    {
                        unique: true,
                        fields: ['record', 'idStage']
                    }
                ]
            },
        );
    }
  static associate(models) {
    this.belongsTo(models.Priority, { foreignKey: 'idPriority', as: 'processPriority' });
    this.belongsTo(models.Stage, { foreignKey: 'idStage', as: 'processStage' });
    this.belongsTo(models.Flow, { foreignKey: 'idFlow', as: 'flowInfo' });
  }
}
ProcessModel.init(sequelizeConfig, Sequelize.DataTypes);
export default ProcessModel;
