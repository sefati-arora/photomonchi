module.exports=(Sequelize,sequelize,DataTypes) =>
{
    return sequelize.define(
        "sessiontable",
        {
            ...require('./core')(Sequelize,DataTypes),
            sessionLength:
            {
                type:DataTypes.STRING(225),
                allowNull:true,
                 defaultValue:null
            },
            sessionPrice:
            {
                type:DataTypes.STRING(225),
                allowNull:true
            },
              categoryId:
            {
                type:Sequelize.UUID,
                allowNull:true,
                references:
                {
                    model:"category",
                    key:"id"
                },
                onUpdate:"CASCADE",
                onDelete:"CASCADE"
            },

        },
        {
            tablename:"sessiontable"
        }
    )
}