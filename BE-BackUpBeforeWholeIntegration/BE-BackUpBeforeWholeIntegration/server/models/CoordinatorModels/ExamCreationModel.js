const mongoose = require("mongoose");

const CreateExamSchema = new mongoose.Schema({
  Term: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FYPTerm",
    required: true,
  },

  ExamType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExamType", // Reference to ExamType model
    required: true,
  },

  ExamWeightage: {
    type: Number,
    required: true,
  },
  AnnouncedDate: {
    type: Date,
    required: true,
  },
  ReportDeadline: {
    type: Date,
    required: false,
  },
  CLOForExams: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CLOForExam", // Assuming the model name for CLOForExam is CLOForExam
  },
  partStatus: {
    type: String,
    enum: ["Part-I", "Part-II"],
    required: true,
  },
  portalCategory: {
    type: String,
    enum: ["Attendance", "Quiz", "Midterm", "Final", "Other"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Completed", "Pending"],
    default: "Active",
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
    required: true,
  },
});

const CreateExam = mongoose.model("CreateExamModel", CreateExamSchema);

module.exports = CreateExam;
