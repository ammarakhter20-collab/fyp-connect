const mongoose = require("mongoose");

const studentReportSchema = new mongoose.Schema({
  submitReportPdf: {
    type: String, // Assuming the PDF is stored as a URL or file path
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser", // Assuming the model name for the general user is 'GenUser'
    required: true,
  },
  FYPGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FypRegistration", // Assuming the model name for the general user is 'GenUser'
    required: true,
  },

  Exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExamType", // Assuming the model name for the general user is 'GenUser'
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now, // Automatically sets the date when the report is uploaded
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  visibleToPanel: {
    type: Boolean,
    default: false,
  },
  supervisorFeedback: {
    type: String,
    default: "",
  },
});

const StudentReport = mongoose.model("StudentReport", studentReportSchema);

module.exports = StudentReport;
