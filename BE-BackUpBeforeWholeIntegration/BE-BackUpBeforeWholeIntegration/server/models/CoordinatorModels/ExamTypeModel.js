const mongoose = require("mongoose");

const ExamTypeSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  examTypeFor: {
    type: String,
    enum: ["All", "Supervisor", "Coordinator", "Student", "HoD", "Examiner"],
    required: true,
  },
  portalCategory: {
    type: String,
    enum: ["Attendance", "Quiz", "Midterm", "Final", "Other"],
    default: "Other",
  },
  defaultPart: {
    type: String,
    enum: ["Part-I", "Part-II"],
    default: "Part-I",
  },
});

const ExamType = mongoose.model("ExamType", ExamTypeSchema);

module.exports = ExamType;
