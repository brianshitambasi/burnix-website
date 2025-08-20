const express = require("express");
const router = express.Router();
const donationController = require("../controller/donationController");
const multer = require("multer");
const path = require("path");

const { auth, authorizeRoles } = require("../middleware/auth");



// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // e.g. 1638300830.jpg
    },
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      // Accept only images
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed!"), false);
      }
      cb(null, true);
    },
  });
  

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
