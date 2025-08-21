const express = require("express");
const router = express.Router();
const beneDash = require("../controller/beneficialyDash");
const { auth, authorizeRoles } = require("../middleware/auth");


router.get("/",auth,authorizeRoles('beneficiary'), beneDash.getBeneficiaryDashboard);


module.exports = router;
