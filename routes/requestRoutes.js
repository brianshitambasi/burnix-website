const express = require("express");
const router = express.Router();
const { Request } = require("../models/models");

// Create a new request
router.post("/requests", async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all requests
router.get("/requests", async (req, res) => {
  try {
    const requests = await Request.find().populate("beneficiaryId");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific request by ID
router.get("/requests/:id", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate(
      "beneficiaryId"
    );
    if (!request) return res.status(404).json({ error: "Request not found" });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a request
router.put("/requests/:id", async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!request) return res.status(404).json({ error: "Request not found" });
    res.json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a request
router.delete("/requests/:id", async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
