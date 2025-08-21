const { Request } = require("../models/models");

// ========================
// Create request (only beneficiary)
// ========================
exports.createRequest = async (req, res) => {
  try {
    if (req.user.role !== "beneficiary") {
      return res.status(403).json({ error: "Only beneficiaries can create requests" });
    }

    const { donation, quantity, notes } = req.body;

    if (!donation || !quantity) {
      return res.status(400).json({ error: "Donation and quantity are required" });
    }

    const request = await Request.create({
      donation,
      quantity,
      notes,
      beneficiary: req.user.userId, // ✅ enforce beneficiary from token
    });

    res.status(201).json(request);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Get all requests
// ========================
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("beneficiary", "name email role")
      .populate("donation", "type quantity description donor");
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Get single request
// ========================
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("beneficiary", "name email role")
      .populate("donation", "type quantity description donor");

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Update request (only owner beneficiary)
// ========================
exports.updateRequest = async (req, res) => {
  try {
    const request = await Request.findOneAndUpdate(
      { _id: req.params.id, beneficiary: req.user.userId }, // ✅ only owner can update
      req.body,
      { new: true, runValidators: true, context: "query" }
    );

    if (!request) {
      return res.status(404).json({ error: "Request not found or not authorized" });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Delete request (only owner beneficiary)
// ========================
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findOneAndDelete({
      _id: req.params.id,
      beneficiary: req.user.userId, // ✅ only owner can delete
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found or not authorized" });
    }

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ error: error.message });
  }
};
