module.exports=(Sequelize,sequelize,DataTypes) =>
{
    return sequelize.define(
        "orderstable",
        {
            ...require('./core')(Sequelize,DataTypes),
            userId:
            {
                type:DataTypes.STRING(225),
                allowNull:true,
                reference:
                {
                    model:"users",
                    key:"id"
                },
                
            },
            title:
            {
                type:DataTypes.STRING(225),
                allowNull:true,
            },
            status:
            {
                type:DataTypes.INTEGER,
                allowNull:true,
                defaultValue:0    //0 for past 1 for current and 2 for upcoming...
            }
        },
        {
            tablename:"orderstable"
        }
    )
}