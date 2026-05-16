const mongoose = require('mongoose');
require('dotenv').config();

// Define models in correct order/way to ensure schemas are registered
const FYPTerm = require('./server/models/AdminModels/fypTerm');
const ExamType = require('./server/models/CoordinatorModels/ExamTypeModel');
const GenUser = require('./server/models/AdminModels/GenUserModel');
// We need to make sure models are registered before requiring ones that ref them if we rely on mongoose.model() calls inside
// But requiring the file usually executes the mongoose.model() line.

const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');
const FypRegistration = require('./server/models/StudentModels/fypRegModel'); // Reg model might ref others
const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function simulate() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const termId = "697b64c756273c082e9eba85"; // Term 121

        console.log(`Querying evaluations for termId: ${termId}`);
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

        console.log(`Found ${evaluationDocs.length} Evaluation documents.`);

        if (evaluationDocs.length === 0) return;

        // Aggregate all exams
        const allExams = [];
        evaluationDocs.forEach(doc => {
            const t = doc.terms.find(termEntry => termEntry.termId.toString() === termId);
            if (t && t.exams) {
                allExams.push(...t.exams);
            }
        });

        // Build Weightage Map
        const weightageMap = {};
        allExams.forEach(exam => {
            const weight = (exam.examId && exam.examId.ExamWeightage) ? exam.examId.ExamWeightage : 0;
            // Also log if examId is missing
            if (!exam.examId) console.log(`WARNING: examId missing for examName: ${exam.examName}`);

            weightageMap[exam.examName] = weight;
        });

        console.log("\n--- Weightage Map ---");
        console.log(weightageMap);

        const studentsMap = {};
        allExams.forEach(exam => {
            exam.fypGroups.forEach(group => {
                group.students.forEach(student => {
                    const sId = student.studentId?._id ? student.studentId._id.toString() : student.studentId?.toString();
                    if (!sId) return;

                    const regno = student.studentId?.registrationNumber || 'N/A';
                    const name = student.studentId?.name || 'Unknown';
                    const marks = student.obtainedAverage || 0;

                    if (!studentsMap[sId]) {
                        studentsMap[sId] = {
                            registrationNumber: regno,
                            name: name,
                            exams: {}
                        };
                    }
                    studentsMap[sId].exams[exam.examName] = marks;
                });
            });
        });

        console.log("\n--- Student Marks & Calculation Check ---");
        Object.keys(studentsMap).forEach(sId => {
            const s = studentsMap[sId];
            console.log(`${s.registrationNumber}: ${s.name}`);
            console.log(`  Raw Marks:`, s.exams);

            // Replicate calculation logic
            const propW = weightageMap['Proposal'] || 0;
            const att1W = weightageMap['Attendance-I'] || 0;
            const mid1W = weightageMap['Mid-I'] || 0;
            const fin1W = weightageMap['Final-I'] || 0;

            const prop = s.exams['Proposal'] || 0;
            const att1 = s.exams['Attendance-I'] || 0;
            const mid1 = s.exams['Mid-I'] || 0;
            const fin1 = s.exams['Final-I'] || 0;

            console.log(`  Weights -> Prop: ${propW}, Att1: ${att1W}, Mid1: ${mid1W}, Fin1: ${fin1W}`);
            console.log(`  Marks   -> Prop: ${prop}, Att1: ${att1}, Mid1: ${mid1}, Fin1: ${fin1}`);

            const total =
                ((prop * propW) / 100) +
                ((att1 * att1W) / 100) +
                ((mid1 * mid1W) / 100) +
                ((fin1 * fin1W) / 100);

            console.log(`  Calculated Total Part I: ${total}`);
        });

        await mongoose.disconnect();
    } catch (e) {
        console.error("Simulation failed:", e);
    }
}

simulate();
