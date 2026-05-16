const mongoose = require("mongoose");

// Define schema for exam assignment
const ExamAssignmentSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FypRegistration", // Assuming there's a FYPGroup model to reference
    required: true,
  },
  termId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FYPTerm", // Assuming there's a FYPGroup model to reference
    required: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department", // Assuming there's a FYPGroup model to reference
    required: true,
  },
  penal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PanelDetails", // Assuming there's a FYPGroup model to reference
    required: true,
  },
  submitBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser", // Assuming there's a FYPGroup model to reference
    required: true,
  },
  examTitle: {
    type: String,
    required: true,
  },
  partStatus: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  dueTime: {
    type: String,
    required: true,
  },
  assignedDate: {
    type: String,
  },

  attachPdf: {
    type: String, // You can adjust the type according to your needs
  },
  submitDate: {
    type: Date,
  },
  submitPdf: {
    type: String,
  },
  reportStatus: {
    type: String,
    enum: ["pending", "submitted"],
    default: "pending",
  },
});

// Create ExamAssignment model
const ExamAssignment = mongoose.model("ExamAssignment", ExamAssignmentSchema);

module.exports = ExamAssignment;
