import {DataTypes, Model, Sequelize} from "sequelize";
import sequelizeConfig from "../config/sequelize.js";

class ProcessesFileModel extends Model {
    static init(sequelize) {
        super.init({
                idProcessesFile: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                status: {
                    type: DataTypes.ENUM({
                        values: ['waiting', 'inProgress', 'error', 'canceled'],
                    }),
                    allowNull: false,
                    defaultValue: 'waiting',
                },
                message: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null,
                },
                importedBy: {
                    type: DataTypes.STRING(11),
                    allowNull: false,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
                },
                importedAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                fileName: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                dataOriginalFile: {
                    type: DataTypes.BLOB,
                    allowNull: false,
                },
                dataResultingFile: {
                    type: DataTypes.BLOB,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'processesFile',
                updatedAt: false,
            },
        );
    }

    static associate(models) {
        this.hasMany(models.ProcessesFileItem, { foreignKey: 'idProcessesFile', as: 'fileItems' });
        this.belongsTo(models.User, { foreignKey: 'importedBy', as: 'userInfo' });
    }
}

ProcessesFileModel.init(sequelizeConfig, Sequelize.DataTypes);

export default ProcessesFileModel;