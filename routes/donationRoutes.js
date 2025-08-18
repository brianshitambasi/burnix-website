const express = require("express");
const router = express.Router();
const donanationController = require("../controller/donationController");

// Donor registration route
router.post("/register", donanationController.registerDonor);

// Donor login route
router.post("/login", donanationController.loginDonor);

module.exports = router;
