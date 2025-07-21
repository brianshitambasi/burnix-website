const mongoose = require("mongoose");
const VolunteerOpportunity = mongoose.model("VolunteerOpportunity");

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
};

module.exports = volunteerOpportunityController;