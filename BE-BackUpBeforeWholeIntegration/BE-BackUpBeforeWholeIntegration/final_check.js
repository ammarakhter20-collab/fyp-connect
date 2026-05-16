const mongoose = require('mongoose');
const ExamCreation = require("./server/models/CoordinatorModels/ExamCreationModel");
const ExamTypeModel = require("./server/models/CoordinatorModels/ExamTypeModel");
const FYPTerm = require("./server/models/AdminModels/fypTerm");

async function run() {
    await mongoose.connect("mongodb://localhost:27017/MIS");
    console.log("Connected");

    const exams = await ExamCreation.find({}).populate("ExamType Term");
    console.log(`Total Exams: ${exams.length}`);
    exams.forEach(e => {
        console.log(`- Exam: ${e.ExamType?.examName} (${e.ExamType?.shortCode})`);
        console.log(`  Term: ${e.Term?.sessionTerm}`);
        console.log(`  Weightage: ${e.ExamWeightage}`);
    });

    await mongoose.disconnect();
}
run();
