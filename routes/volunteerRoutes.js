const express = require("express");
const router = express.Router();
const volunteerController = require("../controller/volunteerController");

router.post("/volunteers", volunteerController.createVolunteerOpportunity); // Updated
router.get("/volunteers", volunteerController.getVolunteerOpportunities);   // Updated
router.get("/volunteers/:id", volunteerController.getVolunteerOpportunityById); // Updated
router.put("/volunteers/:id", volunteerController.updateVolunteerOpportunity);  // Updated
router.delete("/volunteers/:id", volunteerController.deleteVolunteerOpportunity); // Updated

module.exports = router;