const Models=require('../models/index');
const Joi=require("joi");
const helper=require('../helper/validation');
const commonhelper=require('../helper/commonHelper');
module.exports =
{
    imageUpload: async(req,res)=>
    {
       try
       {
         const schema=Joi.object({
            userId:Joi.string().required()
         });
         const payload= await helper.validationJoi(req.body,schema);
         const file= req.files.file
         if(!file)
         {
            return res.status(404).json({message:"file not found"});
         }
         if(Array.isArray)
         {
            file[file];
         }
         for(let i=0;i<file.length;i++)
         {
             const filepath= await commonhelper.fileUpload(file[i]);
              await Models.imageUpload.create(
            {
                userId:payload.userId,
                imageUpload:filepath
            }
         );
         }
        //  const filepath= await commonhelper.fileUpload(file);
        //  const user= await Models.imageUpload.create(
        //     {
        //         userId:payload.userId,
        //         imageUpload:filepath
        //     }
        //  );
         return res.status(200).json({message:"image enter successfully"});
       }
       catch(error)
       {
         console.log(error);
         return res.status(404).json({message:"server error"});
       }
    }
};