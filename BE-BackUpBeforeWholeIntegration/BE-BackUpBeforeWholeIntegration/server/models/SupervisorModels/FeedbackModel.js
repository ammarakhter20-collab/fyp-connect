const mongoose = require("mongoose");

// Define Feedback schema
const feedbackSchema = new mongoose.Schema({
  feedback: {
    type: String,
    required: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FypRegistration",
    required: true,
  },
  // Add other fields as needed
});

// Create Feedback model
const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
