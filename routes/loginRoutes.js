const express=require('express')
const router=express.Router()
const loginController=require("../controller/loginController")


// Register route
router.post("/register", loginController.registerDonor);
router.post("/login", loginController.loginDonor);









module.exports=router