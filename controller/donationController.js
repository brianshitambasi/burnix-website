const { Donation, Request } = require("../models/models");

// ========================
// Create Donation (Donors only)
// ========================
exports.createDonation = async (req, res) => {
  try {
    if (req.user.role !== "donor") {
      return res.json({ message: "Only donors can create donations" });
    }

    const { type, quantity, description } = req.body;

    const donation = new Donation({
      donor: req.user.userId, // from JWT payload
      type,
      quantity,
      description,
    });

    await donation.save();
    return res.status(201).json({ message: "Donation created successfully", donation });
  } catch (error) {
    console.error("Error in createDonation:", error);
    return res.status(500).json({ message: "Server error while creating donation" });
  }
};

// ========================
// Get All Donations (Public)
// ========================
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "name email address role")
      .populate("assignedTo", "name email role")
      .populate("handledBy", "name email role")
      .sort({ createdAt: -1 });

    return res.json(donations);
  } catch (error) {
    console.error("Error in getAllDonations:", error);
    return res.status(500).json({ message: "Server error while fetching donations" });
  }
};

// ========================
// Get Single Donation by ID (Public)
// ========================
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("donor", "name email address role")
      .populate("assignedTo", "name email role")
      .populate("handledBy", "name email role");

    if (!donation) {
      return res.json({ message: "Donation not found" });
    }

    return res.json(donation);
  } catch (error) {
    console.error("Error in getDonationById:", error);
    return res.status(500).json({ message: "Server error while fetching donation" });
  }
};

// view my requated donations
exports.getRequestsForMyDonations = async (req, res) => {
  try {
    // console.log(req.user)
    if (req.user.role !== "donor") {
      return res.status(403).json({ error: "Only donors can view this" });
    }

    const requests = await Request.find()
      .populate({
        path: "donation",
        match: { donor: req.user.userId }, // only donations from this donor
        populate: { path: "donor", select: "name email" },
      })
      .populate("beneficiary", "name email");

    // filter out requests not related to this donor’s donations
    const filtered = requests.filter(r => r.donation !== null);

    res.status(200).json(filtered);
  } catch (error) {
    console.error("Error fetching donor requests:", error);
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Update Donation (Only the donor who created it)
// ========================
exports.updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.json({ message: "Donation not found" });
    }

    // only donor who posted can edit
    if (donation.donor.toString() !== req.user.userId) {
      return res.json({ message: "You are not allowed to edit this donation" });
    }

    const { type, quantity, description, status } = req.body;

    donation.type = type || donation.type;
    donation.quantity = quantity || donation.quantity;
    donation.description = description || donation.description;
    donation.status = status || donation.status;

    await donation.save();
    return res.json({ message: "Donation updated successfully", donation });
  } catch (error) {
    console.error("Error in updateDonation:", error);
    return res.status(500).json({ message: "Server error while updating donation" });
  }
};

// ========================
// Delete Donation (Only the donor who created it)
// ========================
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.json({ message: "Donation not found" });
    }

    // only donor who posted can delete
    if (donation.donor.toString() !== req.user.userId) {
      return res.json({ message: "You are not allowed to delete this donation" });
    }

    await donation.deleteOne();
    return res.json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Error in deleteDonation:", error);
    return res.status(500).json({ message: "Server error while deleting donation" });
  }
};
