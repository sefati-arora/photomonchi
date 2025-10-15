require("dotenv").config();
const Models = require("../models/index");
const Joi = require("joi");
const helper = require("../helper/validation");
const jwt = require("jsonwebtoken");
const commonhelper = require("../helper/commonHelper");
const otpManager = require("node-twillo-otp-manager")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  process.env.TWILIO_SERVICE_SID
);
// const { Op, literal } = require("sequelize");
// const moment = require("moment");
// const cron = require("node-cron");
Models.addressModel.belongsTo(Models.userModel, {
  foreignKey: "userId",
  as: "user",
});
Models.bookingModel.belongsTo(Models.addressModel, {
  foreignKey: "address",
  as: "addressInfo"
});

Models.addressModel.hasMany(Models.bookingModel, {
  foreignKey: "address",
  as: "bookingInfo"
});



// cron.schedule("* * * * *", async () => {
//   const nowStr = moment().format("YYYY-MM-DD HH:mm:ss");
//   try {
//     const [count] = await Models.categoryModel.update(
//       {
//         status: 2,
//       },
//       {
//         where: {
//           status: 1,
//           [Op.and]: literal(
//             `STR_TO_DATE(CONCAT(date, ' ', time), '%e %M %Y %h:%i %p') < STR_TO_DATE('${nowStr}', '%Y-%m-%d %H:%i:%s')`
//           ),
//         },
//       }
//     );
//     console.log("successfully", count);
//   } catch (error) {
//     console.log("error", error);
//   }
// });

// cron.schedule("* * * * *", async () => {
//   try {
//     const now = moment();
//     const currentTime = moment().format("h:mm A"); // ✅ No leading zero
//     const currentDay = now.format("dddd");
//     console.log("corn running at:", currentTime, currentDay);

//     const reminders = await Models.reminderModel.findAll({
//       where: { time: currentTime },
//       raw: true,
//     });
//     console.log("reminders", reminders);
//     console.log("Current Time:", currentTime);

//     for (const reminder of reminders) {
//       if (reminder.reminderType === 1) {
//         const reminderDay = moment(reminder.createdAt).format("dddd");
//         if (reminderDay !== currentDay) {
//           console.log("skipping weekly", reminderDay);
//           continue;
//         }
//       }
//       const user = await Models.userModel.findOne({
//         where: { id: reminder.userId },
//         raw: true,
//       });
//       console.log("===", user);
//       if (!user) {
//         console.log("User not found");
//       }

//       if (user.isNotification !== 0) {
//         console.log("User has notifications turned off", user.isNotification);
//       }
//       const title = "reminder";
//       const message = `Hi ${user.userName}! this is your reminder for ${currentTime}`;
//       const alreadNotified = await Models.notificationModel.findOne({
//         where: {
//           receiverId: user.id,
//           title,
//           Description: message,
//           isNotification: 1,
//           isRead: 0,
//           createdAt: {
//             [Op.gte]: moment().startOf("day").toDate(),
//           },
//         },
//       });
//       console.log("Checking notification for:");
//       console.log("aleradnotified", alreadNotified);
//       console.log("receiverId:", user.id);
//       console.log("title:", title);
//       console.log("description:", message);
//       console.log("isNotification:", 1);
//       console.log("createdAt >= ", moment().startOf("day").toDate());
//       if (alreadNotified) {
//         console.log("Already Notified!");
//       }
//       await Models.notificationModel.create({
//         senderId: null,
//         receiverId: user.id,
//         title,
//         Description: message,
//         isNotification: 1,
//         status: 0,
//       });
//       console.log("notification created..");
//     }
//     console.log("Reminder cron created!");
//   } catch (error) {
//     console.log("ERROR", error);
//   }
// });

module.exports = {
  sidIdGenerateTwilio: async (req, res) => {
    try {
      const serviceSid = await otpManager.createServiceSID("Test", "4");
      console.log("Service SID created:", serviceSid);
      return serviceSid;
    } catch (error) {
      console.error("Error generating Service SID:", error);
      throw new Error("Failed to generate Service SID");
    }
  },
  otpSend: async (req, res) => {
    try {
      const schema = Joi.object({
        phoneNumber: Joi.string().required(),
        countryCode: Joi.string().required(),
      });
      const payload = await helper.validationJoi(req.body, schema);
      const { phoneNumber, countryCode } = payload;
      let user = await Models.userModel.findOne({ phoneNumber });
      if (!user) {
        user = await Models.userModel.create({ phoneNumber, countryCode });
      }

      const phone = countryCode + phoneNumber;
      let response = await otpManager.sendOTP(phone);
      console.log(response);
      return res.status(200).json({ message: "successfully send", response });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "ERROR!", error });
    }
  },
  profileCreated: async (req, res) => {
    try {
      const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        phoneNumber: Joi.string().required(),
      });
      const payload = await helper.validationJoi(req.body, schema);
      const user = await Models.userModel.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
      });
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return res
        .status(200)
        .json({ message: "SUCCESSFULLY PROFILE CREATED!!!", token, user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "ERROR" });
    }
  },
  editProfile: async (req, res) => {
    try {
       const id = req.user?.id;
      console.log("user ID from token:", id);
    if (!id) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }
      const { firstName, lastName, email, phoneNumber } = req.body;
      const profile = await Models.userModel.findOne({ where: { id} });
      if (!profile) {
        return res.status(200).json({ message: "user not found!" });
      }
      await Models.userModel.update(
        {
          firstName,
          lastName,
          email,
          phoneNumber,
        },
        {
          where: { id },
        }
      );
      return res.status(200).json({message:"SUCCESSFULLY UPDATE DATA!"})
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "ERROR", error });
    }
  },
  getProfile: async (req, res) => {
     try {
       const userId = req.user.id;
      //  let user = await Models.userModel.findOne({
      //    where: { id: userId },
      //    include: [
      //      {
      //        model: Models.addressModel,
      //        as: "addresses",
      //      },
      //    ],
      //  });
      //  if(!user)
      //  {
      //   return res.status(404).json({message:"user not found!"})
      //  }
       return res.status(200).json({message:"USER FOUND SUCCESSFULLY"})
       }
       catch(error)
       {
        console.log(error);
        return res.status(500).json({message:"ERROR"})
       }
  },
  deletedAccount:async(req,res) =>
     {
       try
       {
           const id = req.user?.id;
           console.log("user ID from token:", id);
           const user=await Models.userModel.destroy({where:{id}})
           return res.status(200).json({message:"SUCCESSFULLY DATA DELETED",user})
       }
       catch(error)
       {
        console.log(error);
        return res.status(500).json({message:"ERROR"})
       }
     },
     otpVerify: async(req,res ) =>
   {
    try{
     console.log("re.body",req.body);
     const{countryCode,phoneNumber, otp}=req.body;
     if(!otp||!phoneNumber)
     {
      res.status(400).json({message:"please provide otp"});
     }
     const whereCondition={countryCode,phoneNumber,isDeleted:0,};
    const user= await Models.userModel.findOne({where:whereCondition});
    if(!user)
    {
      return res.status(404).json({message:"!user not found"});
    }
    const phone=user.countryCode+user.phoneNumber;
      try {
          const verificationCheck = await otpManager.verifyOTP(phone, otp);
          if (verificationCheck.status != "approved") {
        return res.status(400).json({message:"invalid otp"});
          }
      } catch (err) {
        console.error("Twilio OTP verification failed:", err);
        return res.status(400).json({message:"invalid otp"});
      }
    const userdata=
    {
      otpVerify:1,
    };
    await Models.userModel.update(userdata,{where:{id:user.id}});
    await Models.userModel.findOne({where:{id:user.id}});
    const token=jwt.sign({id:user.id},process.env.SECRET_KEY);
    return res.status(200).json({message:"otp verified successfully",token});
  }
  catch(error)
  {
    console.log(error)
    return res.status(400).json({message:"OTP verification failed"});

  }
    },
  resendOtp: async(req,res) =>
  {
    try{
      const{countryCode,phoneNumber}=req.body;
      const userexist= await Models.userModel.findOne({phoneNumber:req.body.phoneNumber,isDeleted:0});
      const phone= req.body.countryCode+req.body.phoneNumber;
      if(userexist)
      {
        OtpResponse= await otpManager.sendOTP(phone);
        console.log("OTP successfully send",OtpResponse);
        return res.status(200).json({message:"OTP send successfully"});
      }
      else
      {
        return res.status(404).json({message:"User not found"});
      }
    }
    catch(error)
    {
      console.log(error);
      return res.status(400).json({message:"Error while sending OTP"})
    }
  },
  postContactus:async(req,res) =>
  {
    try{
     const userId=req.user.id;
     const {name,email,phoneNumber,message}=req.body;
     const user=await Models.contactusModel.create({
      userId:userId,
      name:name,
      email:email,
      phoneNumber:phoneNumber,
      message:message
     });
     return res.status(200).json({message:"Data post successfully",user})
    }
    catch(error)
    {
      console.log(error);
      return res.status(500).json({message:"ERROR"})
    }
  },
    notification: async (req, res) => {
    try {
      const schema = Joi.object({
        senderId: Joi.string().required(),
        receiverId: Joi.string().required(),
        title: Joi.string().required(),
        message: Joi.string().required(),
        isNotification: Joi.number().valid(0, 1).required(),
      });
      const payload = await helper.validationJoi(req.body, schema);
      const user = await Models.notificationModel.create({
        senderId: payload.senderId,
        receiverId: payload.receiverId,
        title: payload.title,
        message: payload.message,
        isNotification: payload.isNotification,
      });
      return res.status(200).json({ message: "Notification data enter", user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "ERROR!!!!" });
    }
  },
   getnotification: async (req, res) => {
    try {
      const { userId } = req.user.id;
      const notifications = await Models.notificationModel.findAll({
        receiverId: userId,
      });
      if (!notifications) {
        return res.status(404).json({ message: "No notification found" });
      }
      return res.status(200).json({ message: "notification get" ,notifications});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error in notification" });
    }
  },
  Clearnotification: async (req, res) => {
    try {
      const user = await Models.notificationModel.destroy({
        where: { receiverId: req.user.id },
      });
      return res.status(200).json({ message: "notification destroy", user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "ERROR in nofication " });
    }
  },
  address:async(req,res) =>
  {
    try
    {
       const userId =req.user.id;
       const {street,city,country,state,countryId,stateId,houseNumber}=req.body
        const exist=await Models.addressModel.findOne({where:{street,city,country,state,countryId,stateId,houseNumber}})
        if(exist)
        {
          return res.status(404).json({message:"address already exist "})
        }
       const user=await Models.addressModel.create(
        {
         userId,street,city,country,state,countryId,stateId,houseNumber
        }
       )
       return res.status(200).json({message:"ADDRESS ADDED SUCCESSFULLY!!",user})
    }
    catch(error)
    {
      console.log(error);
      return res.status(500).json({message:"ERROR!!"})
    }
  },
  getaddress:async(req,res) =>
  {
    try
    {
       const userId =req.user.id;
       console.log("User ID from request:", req.user.id);
       const address=await Models.addressModel.findOne({where:{userId:userId}})
       if(!address)
       {
        return res.status(404).json({message:" no user found "})
       }
       return res.status(200).json({message:"address get",address})
    }
    catch(error)
    {
      console.log(error);
      return res.status(500).json({message:"ERROR"})
    }
  },
  clearAddress:async(req,res) =>
  {
    try{
    const userId=req.user.id;
     const clearaddress=await Models.addressModel.destroy({where:{userId:userId}})
     return res.status(200).json({message:"CLEAR ADDRESS SUCCESSFULLY!",clearaddress})
    }
    catch(error)
    {
      console.log(error);
      return res.status(500).json({message:"ERROR"})
    }
  },
  bookingDetails:async(req,res) =>
  {
    try
    {
      const { userId, address, sessionBooked, category, bookingLocation, date } = req.body;
    const existingUser = await Models.bookingModel.findOne({
      where: { address, category, bookingLocation }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this booking info" });
    }

       const user=await Models.bookingModel.create({
        userId,
        address,
        category,
        sessionBooked,
        bookingLocation,
          date
       });
        await user.update({ isBookingCompleted: 1 });
       return res.status(200).json({message:"data related to booking enter successfullyy!!",user})
    }
    catch(error)
    {
      console.log(error);
      return res.status(500).json({message:"ERROR!!"})
    }
  },
 bookingrelation:async(req,res) =>
 {
   try
   {
      const{id}=req.body;
      const bookingdetail=await Models.bookingModel.findOne(
        {where:
          {id},
       include:[
        {
          model:Models.addressModel,
          as:"addressInfo"
        }
       ]
      }
    );
    return res.status(200).json({message:"DATA LINKED TOGETHER",bookingdetail})
   }
   catch(error)
   {
    console.log(error);
    return res.status(500).json({message:"ERROR",error})
   }
 },
 clearBooking:async(req,res) =>
 {
  try
  {
    const {id}=req.body;
     const user=await Models.bookingModel.destroy({where:{id:id}})
     return res.status(200).json({message:"BOOKING DETAILS DESTROY"})
  }
  catch(error)
  {
    console.log(error);
    return res.status(500).json({message:"ERROR",error})
  }
 },
 orderDetails:async(req,res) =>
 {
  try
  {
     const{userId,title,bookingId}=req.body;
       if (!userId || !title || !bookingId) {
      return res.status(400).json({ message: "userId and title are required" });
    }
     const user=await Models.ordersModel.create({
      userId,
      title,
      bookingId
     })
     await user.update({status:1});
     return res.status(200).json({message:"DATA RELATED ORDER ENTER",user})
  }
  catch(error)
  {
    console.log(error);
    return res.status(500).json({message:"ERROR",error})
  }
 },
 bookingfind:async(req,res) =>
 {
   try
   {
     const {id}=req.body;
     const user=await Models.bookingModel.findAll({where:{id:id}})
     return res.status(200).json({message:"data find",user});
   }
   catch(error)
   {
    console.log(error);
    return res.status(500).json({message:"ERROR",error})
   }
 }
}
