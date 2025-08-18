// donorController.js
const { Donation, Request } = require("../models/models");

// Donor Dashboard Stats
exports.getDonorDashboard = async (req, res) => {
  try {
    if (req.user.role !== "donor") {
      return res.status(403).json({ error: "Only donors can view dashboard" });
    }

    const donorId = req.user.userId;

    // Total donations
    const totalDonations = await Donation.countDocuments({ donor: donorId });

    // Available donations
    const availableDonations = await Donation.countDocuments({
      donor: donorId,
      status: "available",
    });

    // Assigned (matched with a beneficiary)
    const assignedDonations = await Donation.countDocuments({
      donor: donorId,
      status: "assigned",
    });

    // Completed (delivered successfully)
    const completedDonations = await Donation.countDocuments({
      donor: donorId,
      status: "completed",
    });

    // Requests made on donor’s donations
    const requests = await Request.countDocuments({
      donation: { $in: await Donation.find({ donor: donorId }).distinct("_id") },
    });

    res.status(200).json({
      donor: req.user.name,
      stats: {
        totalDonations,
        availableDonations,
        assignedDonations,
        completedDonations,
        totalRequests: requests,
      },
    });
  } catch (error) {
    console.error("Error fetching donor dashboard:", error);
    res.status(500).json({ error: error.message });
  }
};
