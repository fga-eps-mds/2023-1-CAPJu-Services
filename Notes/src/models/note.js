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
        commentary: DataTypes.STRING(100),
        record: {
          type: DataTypes.STRING(20),
          allowNull: false,
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
        tableName: "note",
      }
    );
  }
}

NoteModel.init(sequelizeConfig, Sequelize.DataTypes);
export default NoteModel;
