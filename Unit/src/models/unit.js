import { Model, DataTypes } from 'sequelize';

class Unit extends Model {
  static init(sequelize) {
    super.init(
      {
        idUnit: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'unit',
      },
    );
  }
}

export default Unit;
