const mongoose = require("mongoose");

// Define schema for task assignment
const TaskAssignmentSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FYPGroup", // Assuming there's a FYPGroup model to reference
    required: true,
  },

  SubmittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser", // Assuming there's a FYPGroup model to reference
    required: false,
  },

  taskTitle: {
    type: String,
    required: true,
  },
  taskNo: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  dueTime: {
    type: String,
    required: true,
  },
  instruction: {
    type: String,
  },
  attachPdf: {
    type: String, // You can adjust the type according to your needs
  },
  submitPdf: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "submitted"],
    default: "pending",
  },
});

// Create TaskAssignment model
const TaskAssignment = mongoose.model("TaskAssignment", TaskAssignmentSchema);

module.exports = TaskAssignment;
