const express= require('express');
const apiController=require("../controller/apiController")
const{authentication}=require('../middleware/authentication');
const adminController=require('../controller/adminController');
const  bookingController=require('../controller/bookingController');
const router= express.Router()

router.get('/sidIdGenerateTwilio',apiController.sidIdGenerateTwilio)
router.post('/otpSend',apiController.otpSend),
router.post('/signIn',apiController.signIn),
router.post('/profileCreated',apiController.profileCreated);
router.post('/editProfile',authentication,apiController.editProfile);
router.post('/deletedAccount',authentication,apiController.deletedAccount);
router.get('/getProfile',authentication,apiController.getProfile),
router.post('/otpVerify',authentication,apiController.otpVerify),
router.post('/resendOtp',authentication,apiController.resendOtp),
router.post('/postContactus',authentication,apiController.postContactus),
router.post('/notification',authentication,apiController.notification),
router.get('/getnotification',authentication,apiController.getnotification),
router.post('/clearnotification',authentication,apiController.Clearnotification),
router.post('/address',authentication,apiController.address),
router.get('/getaddress',authentication,apiController.getaddress),
router.post('/clearAddress',authentication,apiController.clearAddress),
router.post('/category',authentication,adminController.category),
router.post('/sessionlength',authentication,adminController.sessionlength),
router.get('/getsession',authentication,adminController.getsession),
router.get('/bookingDetails',authentication,apiController.bookingDetails),
router.get('/bookingrelation',authentication,apiController.bookingrelation),
router.post('/bookingfind',authentication,apiController.bookingfind),
router.post('/bookingData',authentication,bookingController.bookingData)
module.exports=router;