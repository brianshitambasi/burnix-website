// entry file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// static file accessibility
app.use("/uploads",express.static("uploads"))


// login routes

//login routes
const UserAuth=require('./routes/loginRoutes')
app.use('/user/Auth',UserAuth)

// donation routes
const DonationRoutes = require("./routes/donationRoutes");
app.use("/donation", DonationRoutes);

// donation dash
const donorDash = require("./routes/donorDashRoute");
app.use("/donor/dash", donorDash);

// request routes
const RequestRoutes = require("./routes/requestRoutes");
app.use("/request", RequestRoutes);

// volunteer routes
const VolunteerRoutes = require("./routes/volunteerRoutes");
app.use("/volunteer", VolunteerRoutes);

// beneficiary routes
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
app.use("/api/beneficiaries", beneficiaryRoutes);



// connection to the database
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("mongodb connected"))
.catch(err=>console.log("mongodb connected error",err))



const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})
