module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "category",
    {
      ...require("./core")(Sequelize, DataTypes),
      Name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      Description: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },

      price: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      Picture: {
        type: DataTypes.STRING(255),
        allowNull: true,
      }, 
    },
    {
      timestamps: true,
      tableName: "category",
    }
  );
};
