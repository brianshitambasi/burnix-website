// beneficiaryController.js
const { Donation, Request } = require("../models/models");

// Beneficiary Dashboard Stats
exports.getBeneficiaryDashboard = async (req, res) => {
  try {
    if (req.user.role !== "beneficiary") {
      return res.status(403).json({ error: "Only beneficiaries can view dashboard" });
    }

    const beneficiaryId = req.user.userId;

    // Total requests made
    const totalRequests = await Request.countDocuments({ beneficiary: beneficiaryId });

    // Pending requests (donation not yet assigned/reserved/delivered)
    const pendingRequests = await Request.countDocuments({
      beneficiary: beneficiaryId,
      donation: {
        $in: await Donation.find({ status: "available" }).distinct("_id"),
      },
    });

    // Approved/Assigned donations (matched with beneficiary)
    const assignedDonations = await Donation.countDocuments({
      assignedTo: beneficiaryId,
      status: "reserved",
    });

    // Completed donations (delivered successfully)
    const completedDonations = await Donation.countDocuments({
      assignedTo: beneficiaryId,
      status: "delivered",
    });

    res.status(200).json({
      beneficiary: req.user.name,
      stats: {
        totalRequests,
        pendingRequests,
        assignedDonations,
        completedDonations,
      },
    });
  } catch (error) {
    console.log("Error fetching beneficiary dashboard:", error);
    res.status(500).json({ error: error.message });
  }
};
