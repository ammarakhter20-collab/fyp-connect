const mongoose = require("mongoose");
require("dotenv").config();

// Models
const CreateExam = require("./server/models/CoordinatorModels/ExamCreationModel");
const ExamType = require("./server/models/CoordinatorModels/ExamTypeModel");
const FYPTerm = require("./server/models/AdminModels/fypTerm");
const GenUser = require("./server/models/AdminModels/GenUserModel");

const debugExamQuery = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        // 1. Get Student's Term (This is what the frontend sends as termId)
        const student = await GenUser.findOne({ email: "student@test.com" }).populate('term');
        if (!student) { console.log("Student not found"); return; }

        const termId = student.term._id.toString();
        console.log("Student Term:", student.term.sessionTerm, `(${termId})`);

        // 2. Simulate Controller Logic
        // const exams = await CreateExam.find().populate("Term").populate("ExamType").exec();
        const exams = await CreateExam.find().populate("Term").populate("ExamType");
        console.log(`Fetched ${exams.length} Total Exams.`);

        const role = "Supervisor";

        exams.forEach((exam, i) => {
            console.log(`\nExam #${i + 1}:`);
            console.log(`- Term ID: ${exam.Term ? exam.Term._id.toString() : 'NULL'}`);
            console.log(`- Exam Name: ${exam.ExamType ? exam.ExamType.examName : 'NULL'}`);
            console.log(`- Exam For: ${exam.ExamType ? exam.ExamType.examTypeFor : 'NULL'}`);

            const termMatch = exam.Term && exam.Term._id.toString() === termId;
            const roleMatch = exam.ExamType && (exam.ExamType.examTypeFor === "All" || exam.ExamType.examTypeFor === role);

            console.log(`- Term Match? ${termMatch}`);
            console.log(`- Role Match? ${roleMatch}`);

            if (termMatch && roleMatch) {
                console.log(">>> THIS EXAM SHOULD BE RETURNED <<<");
            }
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

debugExamQuery();
