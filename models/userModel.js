module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      ...require("./core")(Sequelize, DataTypes),
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      countryCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      otpVerify: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0, // 0 not verified 1 verified
      },
      isDeleted: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      isprofileCompleted:
      {
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0 ,    //0for notcompleted 1 for completed
      }
    },
    {
      tablename: "users",
    }
  );
};
