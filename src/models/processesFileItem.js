import {DataTypes, Model, Sequelize} from "sequelize";
import sequelizeConfig from "../config/sequelize.js";

class ProcessesFileItemModel extends Model {
    static init(sequelize) {
        super.init({
                idProcessesFileItem: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                idProcessesFile: {
                    type: DataTypes.INTEGER,
                    foreignKey: true,
                    allowNull: true,
                    references: {
                        model: 'processesFile',
                        key: 'idProcessesFile'
                    }
                },
                idProcess: {
                    type: DataTypes.INTEGER,
                    foreignKey: true,
                    allowNull: true,
                    references: {
                        model: 'process',
                        key: 'idProcess'
                    }
                },
                record: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                nickname: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                flow: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                priority: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.ENUM({
                        values: ['imported', 'manuallyImported', 'error'],
                    }),
                    allowNull: false,
                    defaultValue: 'error',
                },
                message: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null,
                },
            },
            {
                sequelize,
                tableName: 'processesFileItem',
                timestamps: false,
            },
        );
    }

    static associate(models) {
        this.belongsTo(models.ProcessesFile, { foreignKey: 'idProcessesFile', as: 'processesFile' });
        this.belongsTo(models.Process, { foreignKey: 'idProcess', as: 'generatedProcessInfo' });
    }
}

ProcessesFileItemModel.init(sequelizeConfig, Sequelize.DataTypes);

export default ProcessesFileItemModel;