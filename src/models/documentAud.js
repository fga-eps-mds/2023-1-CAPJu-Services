import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelizeConfig from "../config/sequelize.js";

class DocumentAudModel extends Model {
    static init(sequelize) {
        super.init({
                idDocumentAud: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                uuid: {
                    type: DataTypes.STRING(36),
                    allowNull: false,
                    unique: true,
                },
                type: {
                    type: DataTypes.ENUM('PROCESS_EVENTS_XLSX', 'PROCESS_EVENTS_PDF'),
                    allowNull: false,
                },
                emitedAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                emitedBy: {
                    type: DataTypes.STRING(11),
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'documentAud',
                timestamps: false,
            },
        );
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'emitedBy', as: 'userInfo' });
    }
}

DocumentAudModel.init(sequelizeConfig, Sequelize.DataTypes);

export default DocumentAudModel;
