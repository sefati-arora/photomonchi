module.exports=(Sequelize,sequelize,DataTypes) =>
{
    return sequelize.define(
        "faqtable",
        {
            ...require('./core')(Sequelize,DataTypes),
            question:
            {
                type:DataTypes.TEXT("long"),
                allowNull:true
            },
            answer:
            {
                type:DataTypes.TEXT("long"),
                allowNull:true
            }
        },
        {
            tableName:"faqtable"
        }
    )
}