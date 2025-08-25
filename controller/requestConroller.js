const { Request, Donation } = require("../models/models");

// ========================
// Create request (body-based)
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
      beneficiary: req.user.userId,
      status: "pending",
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
      return res.status(403).json({ message: "Only beneficiaries can request donations" });
    }

    const donationId = req.params.id;
    const { quantity, notes } = req.body;

    const donation = await Donation.findById(donationId);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    if (donation.status !== "available") {
      return res.status(400).json({ message: "Donation is not available" });
    }

    if (quantity > donation.quantity) {
      return res.status(400).json({ message: "Requested quantity exceeds available stock" });
    }

    const request = await Request.create({
      donation: donationId,
      quantity,
      notes,
      beneficiary: req.user.userId,
      status: "pending",
    });

    res.json({ message: "Request successfully placed", request });
  } catch (error) {
    console.log("Error making request:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Get all requests (Admin)
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
// Get requests for donations owned by logged-in donor
// ========================
exports.getRequestsForMyDonations = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("beneficiary", "name email")
      .populate({
        path: "donation",
        select: "type quantity description donor status",
        match: { donor: req.user.userId },
      });

    const filtered = requests.filter((r) => r.donation !== null);
    res.json(filtered);
  } catch (error) {
    console.error("Error fetching requests for my donations:", error);
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

    if (!request) return res.status(404).json({ error: "Request not found" });

    res.json(request);
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Update request (only owner/beneficiary)
// ========================
exports.updateRequest = async (req, res) => {
  try {
    const request = await Request.findOneAndUpdate(
      { _id: req.params.id, beneficiary: req.user.userId },
      req.body,
      { new: true, runValidators: true, context: "query" }
    );

    if (!request) return res.status(404).json({ error: "Request not found or not authorized" });

    res.json(request);
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Delete request (only owner/beneficiary)
// ========================
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findOneAndDelete({
      _id: req.params.id,
      beneficiary: req.user.userId,
    });

    if (!request) return res.status(404).json({ error: "Request not found or not authorized" });

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Donor updates request status (approve/reject)
// ========================
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // "approved" | "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const request = await Request.findById(req.params.id).populate("donation");
    if (!request) return res.status(404).json({ error: "Request not found" });

    // Ensure only the donor who owns the donation can update
    if (request.donation.donor.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to update this request" });
    }

    // ✅ Approve logic
    if (status === "approved") {
      if (request.quantity > request.donation.quantity) {
        return res.status(400).json({ error: "Not enough stock to approve request" });
      }

      request.donation.quantity -= request.quantity;

      if (request.donation.quantity === 0) {
        request.donation.status = "reserved";
        request.donation.assignedTo = request.beneficiary;
      }

      await request.donation.save();
    }

    request.status = status;
    await request.save();

    res.json({ message: `Request ${status} successfully`, request });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: error.message });
  }
};
