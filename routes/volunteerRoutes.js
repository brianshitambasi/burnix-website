const express = require("express");
const router = express.Router();

const volunteerController = require("../controller/volunteerController");

router.post("/volunteers", volunteerController.createVolunteer);
router.get("/volunteers", volunteerController.getAllVolunteers);
router.get("/volunteers/:id", volunteerController.getVolunteerById);
router.put("/volunteers/:id", volunteerController.updateVolunteer);
router.delete("/volunteers/:id", volunteerController.deleteVolunteer);

module.exports = router;
