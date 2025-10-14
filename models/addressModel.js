module.exports=(Sequelize,sequelize,DataTypes) =>
{
    return sequelize.define(
        "addresstable",
        {
            ...require('./core')(Sequelize,DataTypes),
           userId: {
            type: Sequelize.UUID,
              allowNull: false,
             references: {
              model: "users",
              key: "id",
        },
           onUpdate: "CASCADE",
             onDelete: "CASCADE",
      },
      street:
      {
        type:DataTypes.STRING(100),
        allowNull:true,
        defaultValue:null
      },
      city:
      {
        type:DataTypes.STRING(100),
        allowNull:true,
        defaultValue:null
      },
      country:
      {
        type:DataTypes.STRING(100),
        allowNull:true,
        defaultValue:null
      },
      state:
      {
        type:DataTypes.STRING(100),
        allowNull:true,
        defaultValue:null
      },
      latitude:
      {
        type:DataTypes.STRING(225),
        allowNull:true,
      },
      longitutde:
      {
        type:DataTypes.STRING(225),
        allowNull:true
      },
      countryId:
      {
        type:DataTypes.STRING(225),
        allowNull:true
      },
      stateId:
      {
        type:DataTypes.STRING(225),
        allowNull:true
      },
      houseNumber:
      {
        type:DataTypes.INTEGER,
        allowNull:true
      }
        },
        {
            tablename:"addresstable" 
        }
    )
}