const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String }, // Corrected: Removed invalid (hashed) syntax
    role: { type: String, enum: ["donor", "volunteer", "NGO", "Beneficiary"], required: true },
    address: { type: String },
  },
  { timestamps: true }
);

// Donation Schema
const donationSchema = new Schema(
  {
    donorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["food", "clothes", "medicine", "money"], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

// Request Schema
const requestSchema = new Schema(
  {
    beneficiaryId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["food", "clothes", "medicine", "money"], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

// Volunteer Opportunity Schema
const volunteerOpportunitySchema = new Schema(
  {
    NGOId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["food", "clothes", "medicine", "money"], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

// Register Models
mongoose.model("User", userSchema);
mongoose.model("Donation", donationSchema);
mongoose.model("Request", requestSchema);
mongoose.model("VolunteerOpportunity", volunteerOpportunitySchema);

module.exports = {
  User: mongoose.model("User"),
  Donation: mongoose.model("Donation"),
  Request: mongoose.model("Request"),
  VolunteerOpportunity: mongoose.model("VolunteerOpportunity"),
};