module.exports=(Sequelize,sequelize,DataTypes) =>
{
    return sequelize.define(
        "notificationtable",
        {
            ...require('./core')(Sequelize, DataTypes),
            senderId:
            {
                type: Sequelize.UUID,
              allowNull: false,
               references: {
                  model: "users",
                  key: "id",
                },
              onUpdate: "CASCADE",
             onDelete: "CASCADE",
            },
            receiverId:
            {
                type: Sequelize.UUID,
              allowNull: false,
               references: {
                  model: "users",
                  key: "id",
                },
              onUpdate: "CASCADE",
             onDelete: "CASCADE",
            },
            title:
            {
                type:DataTypes.STRING(225),
                allowNull:true
            },
            message:
            {
                type:DataTypes.TEXT("long"),
                allowNull:true
            },
            isRead:
            {
                type:DataTypes.INTEGER,
                allowNull:true,
                defaultValue:0   //0 for unread 1 for read
            },
            isnotification:
            {
                type:DataTypes.INTEGER,
                allowNull:true,
                defaultValue:0   //0 for notification on and 1 for ON
            },
            // bookingId:
            // {
            //      type: Sequelize.UUID,
            //       allowNull: false,
            //      references: {
            //       model: "bookingtable",
            //       key: "id",
            //     },
            //   onUpdate: "CASCADE",
            //  onDelete: "CASCADE",
            // }
        }
    )
}