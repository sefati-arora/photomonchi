module.exports=(Sequelize,sequelize,DataTypes) =>
{
    return sequelize.define(
        "bookingtable",
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
            address:
            {
                type:Sequelize.UUID,
                allowNull:true,
                references:
                {
                    model:"addresstables" ,
                    key:"id"
                },
                onUpdate:"CASCADE",
                onDelete:"CASCADE"
            },
            category:
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
            status:
            {
                type:DataTypes.INTEGER,
                allowNull:true,
                defaultValue:0   //0for upcoming,1 for ongoing,2 for completed
            },
            bookingLocation:
            {
                type:DataTypes.STRING(225),
                allowNull:true
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
            isBookingCompleted:
            {
                type:DataTypes.INTEGER,
                allowNull:true,
                defaultValue:0   //0 for completed 1 for not Completed
            },
            sessionBooked:
            {
                 type:Sequelize.UUID,
                allowNull:true,
                references:
                {
                    model:"sessiontables",
                    key:"id"
                },
                onUpdate:"CASCADE",
                onDelete:"CASCADE"
            },
             date:
            {
                type:DataTypes.STRING(225),
                allowNull:true,
            },
        },
        {
            tablename:"bookingtable"
        }
    )
}