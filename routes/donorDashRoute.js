const express = require("express");
const router = express.Router();
const donorDash = require("../controller/donorDash");
const { auth, authorizeRoles } = require("../middleware/auth");


router.get("/",auth,authorizeRoles('donor'), donorDash.getDonorDashboard);


module.exports = router;
