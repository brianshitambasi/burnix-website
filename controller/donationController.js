const mongoose = require("mongoose");
const User = mongoose.model("User");

const userController = {
  async createUser(req, res) {
    try {
      const user = await new User(req.body).save();
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.status(200).json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = userController;