import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class NoteModel extends Model {
  static init(sequelize) {
    super.init(
      {
        idNote: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        commentary: DataTypes.STRING(500),
        idProcess: {
          type: DataTypes.INTEGER,
          references: {
              model: 'process',
              key: 'idProcess',
          },
          allowNull: false,
          onDelete: 'RESTRICT'
        },
        idStageA: {
          type: DataTypes.INTEGER,
          allownull: false,
        },
        idStageB: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'note',
      },
    );
  }
  static associate(models) {
        this.belongsTo(models.Process, { foreignKey: 'idProcess', as: 'relatedProcess' });
    }
}

NoteModel.init(sequelizeConfig, Sequelize.DataTypes);
export default NoteModel;
