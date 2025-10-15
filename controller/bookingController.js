require("dotenv").config();
const Models = require("../models/index");
const Joi = require("joi");
const helper = require("../helper/validation");
const jwt = require("jsonwebtoken");
const commonhelper = require("../helper/commonHelper");

module.exports=
{
    bookingData:async(req ,res) =>
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
}
