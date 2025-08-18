const mongoose = require("mongoose");
const { User } = require("../models/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerDonor = async (req, res) => {
  try {
    const { name, email, password, address, secretkey } = req.body;
    if (secretkey !== process.env.SECRET_KEY) {
      return res.status(401).json({ message: "Unauthorized account creation" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      address,
      role: "donor",
      active: true,
    });
    await user.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error in registerDonor:", error);
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
};

const loginDonor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.active) {
      return res.status(400).json({ message: "User is not active" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in loginDonor:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = {
  registerDonor,
  loginDonor,
};
