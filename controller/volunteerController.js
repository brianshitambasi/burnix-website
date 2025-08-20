const mongoose = require("mongoose");
const VolunteerOpportunity = require('../models/models').VolunteerOpportunity;
const Donation = require('../models/models').Donation;  // Assuming Donation model is exported here
const path = require('path');

const volunteerOpportunityController = {
  async createVolunteerOpportunity(req, res) {
    try {
      const volunteerOpportunity = await new VolunteerOpportunity(req.body).save();
      res.status(201).json(volunteerOpportunity);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getVolunteerOpportunities(req, res) {
    try {
      const volunteerOpportunities = await VolunteerOpportunity.find().populate("NGOId", "name email");
      res.status(200).json(volunteerOpportunities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getVolunteerOpportunityById(req, res) {
    try {
      const volunteerOpportunity = await VolunteerOpportunity.findById(req.params.id).populate("NGOId", "name email");
      if (!volunteerOpportunity) return res.status(404).json({ error: "Volunteer opportunity not found" });
      res.status(200).json(volunteerOpportunity);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateVolunteerOpportunity(req, res) {
    try {
      const volunteerOpportunity = await VolunteerOpportunity.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!volunteerOpportunity) return res.status(404).json({ error: "Volunteer opportunity not found" });
      res.status(200).json(volunteerOpportunity);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteVolunteerOpportunity(req, res) {
    try {
      const volunteerOpportunity = await VolunteerOpportunity.findByIdAndDelete(req.params.id);
      if (!volunteerOpportunity) return res.status(404).json({ error: "Volunteer opportunity not found" });
      res.status(200).json({ message: "Volunteer opportunity deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // New method: Create a donation with photo upload for volunteers
  async createVolunteerDonation(req, res) {
    try {
      const { productName, description, size, quantity } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "Product photo is required" });
      }

      const photoPath = req.file.path;

      // Assuming req.user.userId exists from auth middleware
      const donation = new Donation({
        volunteer: req.user.userId,
        productName,
        description,
        size,
        quantity,
        photo: photoPath,
        status: "pending",
      });

      await donation.save();

      res.status(201).json({ message: "Donation created successfully", donation });
    } catch (error) {
      console.error("Error in createVolunteerDonation:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = volunteerOpportunityController;
