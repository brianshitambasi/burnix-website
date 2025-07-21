const express = require("express");
const router = express.Router();
const { Donation } = require("../models/models");

// Create a new donation
router.post("/donations", async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all donations
router.get("/donations", async (req, res) => {
  try {
    const donations = await Donation.find().populate("donorId");
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific donation by ID
router.get("/donations/:id", async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate("donorId");
    if (!donation) return res.status(404).json({ error: "Donation not found" });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a donation
router.put("/donations/:id", async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!donation) return res.status(404).json({ error: "Donation not found" });
    res.json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a donation
router.delete("/donations/:id", async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) return res.status(404).json({ error: "Donation not found" });
    res.json({ message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
