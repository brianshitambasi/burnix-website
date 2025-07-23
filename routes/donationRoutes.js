const express = require("express");
const router = express.Router();

const donationController = require("../controller/donationController");

// authentication middleware (if needed)
// const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/donations", donationController.createDonation);
router.get("/donations", donationController.getAllDonations);
router.get("/donations/:id", donationController.getDonationById);
router.put("/donations/:id", donationController.updateDonation);
router.delete("/donations/:id", donationController.deleteDonation);

module.exports = router;