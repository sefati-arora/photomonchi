const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("projects", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});
const connectdb = async () => {
  {
    await sequelize.authenticate()
    .then( async () =>
    {
      await sequelize.sync({alter:false})
      console.log("connted db")
    })
    .catch ((error)=> {
      console.log("unable to connect", error);
    })
  }
};

module.exports = {
  connectdb:connectdb,
  sequelize:sequelize
};
