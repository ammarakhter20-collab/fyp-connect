const mongoose = require("mongoose");

// Schema for individual question evaluation
const QuestionEvaluationSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionsForCLO",
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
});

// Schema for individual CLO evaluation
const CLOEvaluationSchema = new mongoose.Schema({
  cloId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ManageCLO",
    required: true,
  },
  questions: [QuestionEvaluationSchema],
  totalPercentage: {
    type: Number,
    required: true,
    default: 0,
  },
  obtainedPercentage: {
    type: Number,
    required: true,
    default: 0,
  },
});

// Schema for individual CLO for exam
const CLOForExamSchema = new mongoose.Schema({
  cloForExamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CLOForExam",
    required: true,
  },
  cloEvaluations: [CLOEvaluationSchema],
  totalCLOPercentage: {
    type: Number,
    required: true,
    default: 0,
  },
  obtainedCLOPercentage: {
    type: Number,
    required: true,
    default: 0,
  },
});

// Schema for individual Examiner
const ExaminerEvaluation = new mongoose.Schema({
  examinerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser",
    required: true,
  },
  evaluations: [CLOForExamSchema],
  marks: Number,
  totalWeightage: Number,
  feedback: {
    type: String,
  },
});

// Schema for individual student evaluation
const StudentEvaluationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser",
    required: true,
  },
  evaluationsByExaminers: [ExaminerEvaluation],
  marks: Number,
  obtainedAverage: Number,
  obtainedAverageofCLO: [
    {
      cloId: mongoose.Schema.Types.ObjectId,
      averageCLOPercentage: Number,
      totalCLOPercentage: Number,
    },
  ],
});

// Schema for FYPGroup evaluation
const FYPGroupEvaluationSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FypRegistration",
    required: true,
  },
  panelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PanelDetails",
  },
  students: [StudentEvaluationSchema],
  approvedStatus: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending", // Default value for resultStatus
  },
});

// Schema for Exam
const ExamSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CreateExamModel",
    required: true,
  },
  examTypeFor: {
    type: String,
    required: true,
  },
  examName: {
    type: String,
    required: true,
  },
  fypGroups: [FYPGroupEvaluationSchema],
});

// Schema for Term
// Schema for Term
const TermSchema = new mongoose.Schema({
  termId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FYPTerm",
    required: true,
  },
  exams: [ExamSchema],
});

// Main Evaluation Schema
const EvaluationSchema = new mongoose.Schema({
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser",
    required: true,
  },
  terms: [TermSchema],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser"
  }
});

const Evaluation = mongoose.model("Evaluation", EvaluationSchema);

module.exports = Evaluation;
