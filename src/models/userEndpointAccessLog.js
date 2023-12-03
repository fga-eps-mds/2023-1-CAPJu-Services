import {DataTypes, Model, Sequelize} from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class UserEndpointAccessLogModel extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                endpoint: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                userCPF: {
                    type: DataTypes.STRING(11),
                    allowNull: true,
                },
                httpVerb: {
                    type: DataTypes.ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE'),
                    allowNull: false,
                },
                attemptTimestamp: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                isAccepted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                service: {
                    type: DataTypes.ENUM('User', 'ProcessManagment', 'Unit', 'Role', 'Unit'),
                    allowNull: false,
                },
                message: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                }
            },
            {
                sequelize,
                timestamps: false,
                tableName: 'userEndpointAccessLog',
            },
        );
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userCPF', as: 'userInfo' });
    }
}

UserEndpointAccessLogModel.init(sequelizeConfig, Sequelize.DataTypes);
export default UserEndpointAccessLogModel;
