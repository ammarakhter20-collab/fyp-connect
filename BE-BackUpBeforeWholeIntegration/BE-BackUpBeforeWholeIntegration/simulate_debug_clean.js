const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

// Register ALL models first
const FYPTerm = require('./server/models/AdminModels/fypTerm');
const ExamType = require('./server/models/CoordinatorModels/ExamTypeModel');
const GenUser = require('./server/models/AdminModels/GenUserModel');
const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel'); // This registers CreateExamModel
const FypRegistration = require('./server/models/StudentModels/fypRegModel');
const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function simulate() {
    let output = "";
    const log = (msg) => { console.log(msg); output += msg + "\n"; };

    try {
        await mongoose.connect(process.env.MONGO_URL);
        const termId = "697b64c756273c082e9eba85";

        log(`Querying evaluations for termId: ${termId}`);
        const evaluationDocs = await Evaluation.find({ "terms.termId": termId })
            .populate({
                path: 'terms.exams.examId',
                select: 'ExamWeightage ExamType',
                populate: {
                    path: 'ExamType',
                    select: 'examName examTypeFor'
                }
            })
            .populate({
                path: 'terms.exams.fypGroups.students.studentId',
                select: 'name registrationNumber'
            });

        const allExams = [];
        evaluationDocs.forEach(doc => {
            const t = doc.terms.find(termEntry => termEntry.termId.toString() === termId);
            if (t && t.exams) {
                allExams.push(...t.exams);
            }
        });

        allExams.forEach(exam => {
            log(`Exam Name: '${exam.examName}'`);
            const codes = [];
            for (let i = 0; i < exam.examName.length; i++) {
                codes.push(exam.examName.charCodeAt(i));
            }
            log(`  CharCodes: ${codes.join(', ')}`);

            const weight = (exam.examId && exam.examId.ExamWeightage) ? exam.examId.ExamWeightage : 0;
            log(`  Weight: ${weight}`);
        });

        fs.writeFileSync('debug_clean.txt', output, 'utf8');
        await mongoose.disconnect();
    } catch (e) {
        log("Simulation failed: " + e.message);
        fs.writeFileSync('debug_clean.txt', output, 'utf8');
    }
}

simulate();
