const mongoose = require("mongoose");

const FYPTermSchema = new mongoose.Schema({
  sessionTerm: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "activated", // Set default status to "activated"
    enum: ["activated", "deactivated"], // Optional: Enumerate possible status values
  },
});

const FYPTerm = mongoose.model("FYPTerm", FYPTermSchema);

module.exports = FYPTerm;
