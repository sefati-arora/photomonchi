require("dotenv").config();
const Models=require('../models/index');
const Joi=require('joi');
const helper=require('../helper/validation');
const Helper=require('../helper/commonHelper');
Models.categoryModel.hasMany(Models.sessionModel, {
  foreignKey: "categoryId",
  as: "sessions",
});
Models.sessionModel.belongsTo(Models.categoryModel, {
  foreignKey: "categoryId",
  as: "category",
});

module.exports=
{
    category:async(req ,res) =>
    {
        try
        {
          const schema=Joi.object({
            Name:Joi.string().required(),
            Description:Joi.string().required(),
            price:Joi.string().required()
          });
          const payload=await helper.validationJoi(req.body,schema);
          const file=req.files?.file;
           console.log(">>>>>>>>>>>>",file)
          if(!file)
          {
            return res.status(404).json({message:"file not found"});
            
          }
              const filepath=await Helper.fileUpload(file);
              const user= await Models.categoryModel.create({
                Name:payload.Name,
                Description:payload.Description,
                price:payload.price,
                Picture:filepath
              })
              
              return res.status(200).json({message:"DATA RELATED CATEGORY ENTER SUCCESSFULLY!",user})
        }
        catch(error)
        {
            console.log(error)
            return res.status(500).json({message:"ERROR"})
        }
    },
    sessionlength:async(req,res) =>
    {
        try
        {
          const schema=Joi.object({
            sessionLength:Joi.string().required(),
            sessionPrice:Joi.string().required(),
            categoryId:Joi.string().required()
          });
          const payload=await helper.validationJoi(req.body,schema);
          const user=await Models.sessionModel.create({
            sessionLength:payload.sessionLength,
            sessionPrice:payload.sessionPrice,
            categoryId:payload.categoryId
        });
          return res.status(200).json({message:"successfully enter data by admin",user})
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).json({message:"ERROR!!"})
        }
    },
    getsession:async(req,res) =>
    {
        try
        {
          console.log(".>>>>>>>>>",req.body)
          const {id} = req.body;
          const session=await Models.sessionModel.findOne(
            {
              where:
              {
                id
              },
            include:[
                {
                    model:Models.categoryModel,
                    as:"category"
                },
            ]
        });
          return res.status(200).json({message:"relation created!",session})
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).json({message:"error"})
        }
      }
}