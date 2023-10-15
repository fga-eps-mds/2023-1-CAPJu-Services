import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelizeConfig from "../config/sequelize.js";

class ProcessAudModel extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            idProcess: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'process',
                    key: 'idProcess'
                }
            },
            processRecord: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            operation: {
                type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE', 'NOTE CHANGE'),
                allowNull: false,
            },
            changedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            changedBy: {
                type: DataTypes.STRING(11),
                allowNull: false,
            },
            oldValues: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            newValues: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            },
            {
                sequelize,
                tableName: 'processAud',
                timestamps: false,
            },
        );
    }

    static associate(models) {
        this.belongsTo(models.Process, { foreignKey: 'idProcess', as: 'relatedProcess' });
        this.belongsTo(models.User, { foreignKey: 'changedBy', as: 'userInfo' });
    }
}

ProcessAudModel.init(sequelizeConfig, Sequelize.DataTypes);

export default ProcessAudModel;
