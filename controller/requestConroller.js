const mongoose = require("mongoose");
const Request = mongoose.model("Request");

const requestController = {
  async createRequest(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body cannot be empty" });
      }
      const request = await Request.create(req.body);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getRequests(req, res) {
    try {
      const requests = await Request.find()
        .populate("beneficiaryId", "name email");
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getRequestById(req, res) {
    try {
      const request = await Request.findById(req.params.id)
        .populate("beneficiaryId", "name email");
      if (!request) return res.status(404).json({ error: "Request not found" });
      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateRequest(req, res) {
    try {
      const request = await Request.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true, context: 'query' }
      );
      if (!request) return res.status(404).json({ error: "Request not found" });
      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteRequest(req, res) {
    try {
      const request = await Request.findByIdAndDelete(req.params.id);
      if (!request) return res.status(404).json({ error: "Request not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = requestController;