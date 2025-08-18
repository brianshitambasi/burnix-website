const express = require("express");
const router = express.Router();
const donationController = require("../controller/donationController");
const { auth, authorizeRoles } = require("../middleware/auth");

// Create donation (only donor)
router.post("/", auth,authorizeRoles('donor'), donationController.createDonation);

// Get all donations (public)
router.get("/", donationController.getAllDonations);
router.get("/my-donation", auth,donationController.getRequestsForMyDonations);

// Get single donation (public)
router.get("/:id", donationController.getDonationById);

// Update donation (only owner)
router.put("/:id", auth,authorizeRoles('donor'), donationController.updateDonation);

// Delete donation (only owner)
router.delete("/:id", auth,authorizeRoles('donor'), donationController.deleteDonation);

module.exports = router;
