const { User, Donation, Request, VolunteerTask } = require("../models/models");

// Get dashboard data statistics for admin
exports.adminDashStats = async (req, res) => {
  try {
    // count stats
    const [totalDonors, totalVolunteers, totalBeneficiaries, totalRequests, totalDonations, activeUsers] =
      await Promise.all([
        User.countDocuments({ role: "donor" }),
        User.countDocuments({ role: "volunteer" }),
        User.countDocuments({ role: "beneficiary" }),
        Request.countDocuments(),
        Donation.countDocuments(),
        User.countDocuments({ active: true }),
      ]);

    // recent records
    const recentDonors = await User.find({ role: "donor" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    const recentVolunteers = await User.find({ role: "volunteer" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    const recentBeneficiaries = await User.find({ role: "beneficiary" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    const recentRequests = await Request.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("beneficiary", "name email")
      .populate("donation", "type status");

    const recentDonations = await Donation.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("donor", "name email");

    // return response
    res.status(200).json({
      stats: {
        totalDonors,
        totalVolunteers,
        totalBeneficiaries,
        totalRequests,
        totalDonations,
        activeUsers,
      },
      recent: {
        donors: recentDonors,
        volunteers: recentVolunteers,
        beneficiaries: recentBeneficiaries,
        requests: recentRequests,
        donations: recentDonations,
      },
    });
  } catch (error) {
    console.error("Error in adminDashStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
