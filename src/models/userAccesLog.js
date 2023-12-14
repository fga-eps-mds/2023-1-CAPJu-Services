import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class UserAccessLogModel extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        sessionId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          unique: true,
        },
        loginTimestamp: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        logoutTimestamp: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        expirationTimestamp: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        stationIp: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
        jwtToken: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        logoutInitiator: {
          type: DataTypes.ENUM(
            'adminInitiated',
            'userRequested',
            'tokenExpired',
            'timeoutDueToInactivity',
            'sessionRenewalOnSameStation',
          ),
          allowNull: true,
          defaultValue: null,
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: null,
        },
        userCPF: {
          type: DataTypes.STRING(11),
          allowNull: false,
          onDelete: 'RESTRICT',
        },
      },
      {
        sequelize,
        timestamps: false,
        tableName: 'userAccessLog',
      },
    );
  }
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userCPF', as: 'userInfo' });
  }
}

UserAccessLogModel.init(sequelizeConfig, Sequelize.DataTypes);
export default UserAccessLogModel;
