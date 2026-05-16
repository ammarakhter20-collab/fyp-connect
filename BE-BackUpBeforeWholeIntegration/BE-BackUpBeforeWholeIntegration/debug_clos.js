const mongoose = require('mongoose');
const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');
const Term = require('./server/models/AdminModels/fypTerm');
const ExamType = require('./server/models/CoordinatorModels/ExamTypeModel');
const CLOForExam = require('./server/models/CoordinatorModels/CLOForExamModel');
const CLOs = require('./server/models/CoordinatorModels/CLOsModel');
const CreateExamSchedule = require('./server/models/CoordinatorModels/ExamScheduleModel');

const MONGO_URL = "mongodb://localhost:27017/MIS";

const debugCLOs = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");

        // 1. Find Term 121
        const term = await Term.findOne({ sessionTerm: "121" });
        if (!term) {
            console.log("Term 121 not found. Listing all terms:");
            const terms = await Term.find();
            terms.forEach(t => console.log(`- ${t.sessionTerm}`));
            return;
        }
        console.log(`Found Term 121: ${term._id}`);

        // 2. Find ExamType Mid-I
        const examType = await ExamType.findOne({ examName: "Mid-I" });
        if (!examType) {
            console.log("ExamType Mid-I not found.");
            return;
        }
        console.log(`Found ExamType Mid-I: ${examType._id}`);

        // 3. Find CreateExam
        const exam = await CreateExam.findOne({ Term: term._id, ExamType: examType._id });
        if (!exam) {
            console.log("CreateExam not found for this Term and ExamType.");
            // Listing all exams for this term
            const exams = await CreateExam.find({ Term: term._id }).populate('ExamType');
            console.log("Exams in this term:", exams.map(e => e.ExamType.examName));
            return;
        }
        console.log(`Found CreateExam: ${exam._id}`);
        console.log(`CLOForExams Field: ${exam.CLOForExams}`);

        if (!exam.CLOForExams) {
            console.log("!!! CLOForExams is NULL or undefined on the exam document.");
            console.log("Use verify_single_term.js or similar to assign CLOs if needed.");
            return;
        }

        // 4. Check CLOForExam Document
        const cloForExamDoc = await CLOForExam.findById(exam.CLOForExams).populate({
            path: 'CLOs',
            populate: { path: 'Questions' }
        });

        if (!cloForExamDoc) {
            console.log(`!!! CLOForExam document not found in DB with ID: ${exam.CLOForExams}`);
            return;
        }

        console.log("CLOForExam Document Found.");
        console.log(`Number of CLOs: ${cloForExamDoc.CLOs.length}`);
        cloForExamDoc.CLOs.forEach(c => {
            console.log(`- CLO: ${c.CLOCode} (${c.Title})`);
            console.log(`   Questions: ${c.Questions ? c.Questions.length : 0}`);
        });

        // 5. Check Schedule
        const schedule = await CreateExamSchedule.findOne({ CreatedExam: exam._id });
        if (!schedule) {
            console.log("No schedule found for this exam.");
        } else {
            console.log(`Schedule found: ${schedule._id}`);
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

debugCLOs();
