const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser",
    required: true,
  },
  feedbackBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser",
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creationTime: {
    type: Date,
    default: Date.now, // Set default value to current date and time
  },
});

const Feedback = mongoose.model("FeedbackToCoord", feedbackSchema);

module.exports = Feedback;
