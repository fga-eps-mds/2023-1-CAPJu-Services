import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class PasswordResetModel extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        userCPF: {
          type: DataTypes.STRING(11),
          allowNull: false,
          references: {
            model: 'users',
            key: 'cpf',
          },
        },
        token: {
          type: DataTypes.STRING(256),
          allowNull: false,
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'passwordResets',
        timestamps: false,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userCPF', as: 'userInfo' });
  }
}

PasswordResetModel.init(sequelizeConfig, Sequelize.DataTypes);
export default PasswordResetModel;
