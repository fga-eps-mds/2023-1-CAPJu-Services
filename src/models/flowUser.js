import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class FlowUserModel extends Model {
  static init(sequelize) {
    super.init(
      {
        idFlowUser: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        cpf: {
          type: DataTypes.STRING(11),
          allowNull: false,
        },
        idFlow: {
          type: DataTypes.INTEGER,
          foreignKey: true,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'flowUser',
      },
    );
  }
  static associate(models) {
    this.belongsToMany(models.Flow, {
      foreignKey: 'idFlow',
      through: 'idFlowuser',
      as: 'flow',
    });
  }
}
FlowUserModel.init(sequelizeConfig, Sequelize.DataTypes);
export default FlowUserModel;
