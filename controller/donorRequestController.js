const { Donation, Request } = require("../models/models");

// ========================
// Get all requests for donor's donations
// ========================
exports.getMyDonationRequests = async (req, res) => {
    try {
      const donorId = req.user.userId;
  
      // Get all donations created by this donor
      const myDonations = await Donation.find({ donor: donorId }).select("_id");
      const donationIds = myDonations.map(d => d._id);
  
      // Find requests linked to those donations
      const requests = await Request.find({ donation: { $in: donationIds } })
        .populate("donation", "type description donor")
        .populate("beneficiary", "name email");
  
      res.json(requests);
    } catch (error) {
      console.error("Error fetching donor requests:", error);
      res.status(500).json({ error: error.message });
    }
  };
  

  // Approve request
// Approve request
exports.approveRequest = async (req, res) => {
    try {
      const { id } = req.params;
  
      const request = await Request.findById(id).populate("donation");
      if (!request) return res.status(404).json({ message: "Request not found" });
      if (!request.donation) return res.status(400).json({ message: "Donation not linked to request" });
  
      // Only donor who owns the donation can approve
      if (request.donation.donor?.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Not authorized to approve this request" });
      }
  
      // ✅ Update request and donation
      request.status = "approved";
      await request.save();
  
      request.donation.status = "reserved";
      request.donation.assignedTo = request.beneficiary;
      await request.donation.save();
  
      res.json({
        message: "Request approved successfully and donation assigned to beneficiary",
        request,
      });
    } catch (error) {
      console.error("❌ Approve error:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  // Reject request
  exports.rejectRequest = async (req, res) => {
    try {
      const { id } = req.params;
  
      // find the request & populate donation
      const request = await Request.findById(id).populate("donation");
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
  
      // ensure donation exists
      if (!request.donation) {
        return res.status(400).json({ message: "Donation not linked to request" });
      }
  
      // ensure donor matches logged-in user
      if (request.donation.donor?.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Not authorized to reject this request" });
      }
  
      // update status
      request.status = "rejected";
      await request.save();
  
      res.json({
        message: "Request rejected successfully",
        request,
      });
    } catch (error) {
      console.error("❌ Reject error:", error);
      res.status(500).json({ error: error.message });
    }
  };
  