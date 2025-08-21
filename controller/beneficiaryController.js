const User = require("../models/models"); // adjust path if needed
const bcrypt = require("bcryptjs");

/**
 * Create a new beneficiary
 */
exports.createBeneficiary = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const beneficiary = new User({
      name,
      email,
      password: hashedPassword,
      address,
      role: "beneficiary", // force role to beneficiary
    });

    await beneficiary.save();
    res.status(201).json({ message: "Beneficiary created successfully", beneficiary });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Get all beneficiaries
 */
exports.getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await User.find({ role: "beneficiary" });
    res.status(200).json(beneficiaries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Get a single beneficiary by ID
 */
exports.getBeneficiaryById = async (req, res) => {
  try {
    const beneficiary = await User.findOne({ _id: req.params.id, role: "beneficiary" });
    if (!beneficiary) {
      return res.status(404).json({ message: "Beneficiary not found" });
    }
    res.status(200).json(beneficiary);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Update beneficiary by ID
 */
exports.updateBeneficiary = async (req, res) => {
  try {
    const { name, email, password, address, active } = req.body;

    let updateData = { name, email, address, active };
    // hash password if updated
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const beneficiary = await User.findOneAndUpdate(
      { _id: req.params.id, role: "beneficiary" },
      { $set: updateData },
      { new: true }
    );

    if (!beneficiary) {
      return res.status(404).json({ message: "Beneficiary not found" });
    }

    res.status(200).json({ message: "Beneficiary updated successfully", beneficiary });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Delete beneficiary by ID
 */
exports.deleteBeneficiary = async (req, res) => {
  try {
    const beneficiary = await User.findOneAndDelete({ _id: req.params.id, role: "beneficiary" });
    if (!beneficiary) {
      return res.status(404).json({ message: "Beneficiary not found" });
    }
    res.status(200).json({ message: "Beneficiary deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
