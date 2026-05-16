const mongoose = require('mongoose');
require('dotenv').config();

const CreateExamSchema = new mongoose.Schema({
  Term: { type: mongoose.Schema.Types.ObjectId, ref: "FYPTerm", required: true },
  ExamType: { type: mongoose.Schema.Types.ObjectId, ref: "ExamType", required: true },
  ExamWeightage: { type: Number, required: true },
  AnnouncedDate: { type: Date, required: true },
  ReportDeadline: { type: Date, required: false },
  partStatus: { type: String, enum: ["Part-I", "Part-II", "General"], required: true },
  portalCategory: { type: String, enum: ["Attendance", "Quiz", "Midterm", "Final", "Other"], required: true },
  status: { type: String, enum: ["Active", "Completed", "Pending"], default: "Active" },
});

const CreateExam = mongoose.model("CreateExamModel", CreateExamSchema);

async function dumpExams() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/MIS'); // Corrected DB name
    console.log("Connected to DB");
    const exams = await CreateExam.find(); // Removed populate to avoid schema errors
    console.log(JSON.stringify(exams, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

dumpExams();
