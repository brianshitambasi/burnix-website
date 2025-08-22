const { User } = require("../models/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ========================
// Register User
// ========================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Validate role
    if (role && !["donor", "beneficiary", "volunteer","admin"].includes(role)) {
      return res.json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      address,
      role: role, 
    });

    await user.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ========================
// Login User
// ========================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,  
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};
