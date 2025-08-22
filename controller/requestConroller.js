const { Request, Donation } = require("../models/models");

// ========================
// Create request (body-based)
// ========================
exports.createRequest = async (req, res) => {
  try {
    if (req.user.role !== "beneficiary") {
      return res.json({ error: "Only beneficiaries can create requests" });
    }

    const { donation, quantity, notes } = req.body;

    if (!donation || !quantity) {
      return res.json({ error: "Donation and quantity are required" });
    }

    const request = await Request.create({
      donation,
      quantity,
      notes,
      beneficiary: req.user.userId,
    });

    res.json(request);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Create request for specific donation (button action)
// ========================
exports.makeRequestForDonation = async (req, res) => {
  try {
    if (req.user.role !== "beneficiary") {
      return res.json({ message: "Only beneficiaries can request donations" });
    }

    const donationId = req.params.id;
    const { quantity, notes } = req.body;

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.json({ message: "Donation not found" });
    }
    if (donation.status !== "available") {
      return res.json({ message: "Donation is not available" });
    }
    if (quantity > donation.quantity) {
      return res.json({ message: "Requested quantity exceeds available stock" });
    }

    const request = await Request.create({
      donation: donationId,
      quantity,
      notes,
      beneficiary: req.user.userId,
    });

    if (quantity === donation.quantity) {
      donation.status = "reserved";
      donation.assignedTo = req.user.userId;
      await donation.save();
    }

    res.json({
      message: "Request successfully placed",
      request,
    });
  } catch (error) {
    console.log("Error making request:", error);
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

    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Get requests for logged-in beneficiary
// ========================
exports.getMyRequests = async (req, res) => {
  try {
    // req.user.userId comes from your auth middleware
    const requests = await Request.find({ beneficiary: req.user.userId })
      .populate("beneficiary", "name email role")
      .populate("donation", "type quantity description donor");

    res.json(requests);
  } catch (error) {
    console.error("Error fetching my requests:", error);
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
      return res.json({ error: "Request not found" });
    }

    res.json(request);
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Update request (only owner)
// ========================
exports.updateRequest = async (req, res) => {
  try {
    const request = await Request.findOneAndUpdate(
      { _id: req.params.id, beneficiary: req.user.userId },
      req.body,
      { new: true, runValidators: true, context: "query" }
    );

    if (!request) {
      return res.json({ error: "Request not found or not authorized" });
    }

    res.json(request);
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Delete request (only owner)
// ========================
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findOneAndDelete({
      _id: req.params.id,
      beneficiary: req.user.userId,
    });

    if (!request) {
      return res.json({ error: "Request not found or not authorized" });
    }

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ error: error.message });
  }
};
