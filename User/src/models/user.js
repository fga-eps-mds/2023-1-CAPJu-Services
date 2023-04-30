const UserModel = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    cpf: {
      type: DataTypes.STRING(11),
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    idUnit: {
      type: DataTypes.INTEGER,
      foreignKey: true,
      allowNull: false,
    },
    idRole: {
      type: DataTypes.INTEGER,
      foreignKey: true,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: "users",
  })

  return User
}

export default UserModel;
