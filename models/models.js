  const mongoose = require("mongoose");
  const { Schema } = mongoose;

  // ========================
  // User Schema
  // ========================
  const userSchema = new Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      address: { type: String, required: true },
      role: {
        type: String,
        enum: ["donor", "volunteer", "beneficiary"],
        required: true,
      },
      active: { type: Boolean, default: true },
    },
    { timestamps: true }
  );

  // ========================
  // Donation Schema
  // ========================
  const donationSchema = new Schema(
    {
      donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      type: {
        type: String,
        required: true,
      },
      photo: { type: String }, // path to the photo file
      quantity: { type: Number, required: true }, // number of items or amount
      description: { type: String }, // e.g. "5 winter jackets"
      status: {
        type: String,
        enum: ["available", "reserved", "delivered"],
        default: "available",
      },
      assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // beneficiary
      handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // volunteer
      date: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );

  // ========================
  // Request Schema
  // ========================
  const requestSchema = new mongoose.Schema({
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    notes: {
      type: String
    },
    beneficiary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  }, { timestamps: true });

  // ========================
  // Volunteer Task Schema (Optional)
  // ========================
  const volunteerTaskSchema = new Schema(
    {
      volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      donation: { type: mongoose.Schema.Types.ObjectId, ref: "Donation" },
      request: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
      status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
      },
    },
    { timestamps: true }
  );

  // ========================
  // Register Models
  // ========================
  const User = mongoose.model("User", userSchema);
  const Donation = mongoose.model("Donation", donationSchema);
  const Request = mongoose.model("Request", requestSchema);
  const VolunteerTask = mongoose.model("VolunteerTask", volunteerTaskSchema);

  module.exports = {
    User,
    Donation,
    Request,
    VolunteerTask,
  };
