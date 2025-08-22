const { Donation, Request } = require("../models/models");

// ========================
// Get all requests for donor's donations
// ========================
exports.getMyDonationRequests = async (req, res) => {
  try {
    const donorId = req.user._id;

    // Find donations by this donor
    const requests = await Request.find()
      .populate("donation", "type description donor")
      .populate("beneficiary", "name email")
      .where("donation")
      .in(await Donation.find({ donor: donorId }).distinct("_id"));

    res.json(requests);
  } catch (error) {
    console.error("Error fetching donor requests:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Approve request
// ========================
exports.approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("donation");
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.donation.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "approved";
    await request.save();

    // Optionally mark donation as reserved
    request.donation.status = "reserved";
    request.donation.assignedTo = request.beneficiary;
    await request.donation.save();

    res.json({ message: "Request approved", request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Reject request
// ========================
exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("donation");
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.donation.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Request rejected", request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
