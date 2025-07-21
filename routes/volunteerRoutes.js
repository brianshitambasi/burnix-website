const express = require("express");
const router = express.Router();
const { VolunteerOpportunity } = require("../models/models");

// Create a new volunteer opportunity
router.post("/volunteer-opportunities", async (req, res) => {
  try {
    const volunteerOpportunity = new VolunteerOpportunity(req.body);
    await volunteerOpportunity.save();
    res.status(201).json(volunteerOpportunity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all volunteer opportunities
router.get("/volunteer-opportunities", async (req, res) => {
  try {
    const volunteerOpportunities = await VolunteerOpportunity.find().populate(
      "NGOId"
    );
    res.json(volunteerOpportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific volunteer opportunity by ID
router.get("/volunteer-opportunities/:id", async (req, res) => {
  try {
    const volunteerOpportunity = await VolunteerOpportunity.findById(
      req.params.id
    ).populate("NGOId");
    if (!volunteerOpportunity)
      return res.status(404).json({ error: "Volunteer Opportunity not found" });
    res.json(volunteerOpportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a volunteer opportunity
router.put("/volunteer-opportunities/:id", async (req, res) => {
  try {
    const volunteerOpportunity = await VolunteerOpportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!volunteerOpportunity)
      return res.status(404).json({ error: "Volunteer Opportunity not found" });
    res.json(volunteerOpportunity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a volunteer opportunity
router.delete("/volunteer-opportunities/:id", async (req, res) => {
  try {
    const volunteerOpportunity = await VolunteerOpportunity.findByIdAndDelete(
      req.params.id
    );
    if (!volunteerOpportunity)
      return res.status(404).json({ error: "Volunteer Opportunity not found" });
    res.json({ message: "Volunteer Opportunity deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
