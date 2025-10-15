const Sequelize= require("sequelize");
const sequelize= require('../config/connectdb').sequelize;

module.exports={
      userModel: require('./userModel')(Sequelize,sequelize,Sequelize.DataTypes),
       categoryModel:require('./categoryModel')(Sequelize,sequelize,Sequelize.DataTypes),
        bookingModel:require('./bookingModel')(Sequelize,sequelize,Sequelize.DataTypes),
       sessionModel:require('./sessionModel')(Sequelize,sequelize,Sequelize.DataTypes),
      imageUpload:require('./imageUpload')(Sequelize,sequelize,Sequelize.DataTypes),
      notificationModel:require('./notificationModel')(Sequelize,sequelize,Sequelize.DataTypes),
       addressModel:require('./addressModel')(Sequelize,sequelize,Sequelize.DataTypes),
       ordersModel:require('./ordersModel')(Sequelize,sequelize,Sequelize.DataTypes),
       contactusModel:require('./contactusModel')(Sequelize,sequelize,Sequelize.DataTypes)
}