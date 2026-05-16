const mongoose = require('mongoose');
require('dotenv').config();

// Load ALL related models
require('./server/models/AdminModels/fypTerm');
require('./server/models/CoordinatorModels/ExamTypeModel');
require('./server/models/StudentModels/fypRegModel');
require('./server/models/AdminModels/GenUserModel');
const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');
const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');

async function simulate() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const termId = "697b64c756273c082e9eba85"; // Term 121

        const evaluationDocs = await Evaluation.find({ "terms.termId": termId })
            .populate({
                path: 'terms.exams.examId',
                select: 'ExamWeightage examName examType',
                populate: {
                    path: 'examType',
                    select: 'examTypeFor'
                }
            })
            .populate({
                path: 'terms.exams.fypGroups.students.studentId',
                select: 'name registrationNumber'
            });

        console.log(`Found ${evaluationDocs.length} Evaluation documents.`);

        if (evaluationDocs.length === 0) {
            console.log("No Evaluation documents found for this term ID query.");
            // Try find without ID filter and then match in JS
            const allEvals = await Evaluation.find({}).populate({
                path: 'terms.exams.fypGroups.students.studentId',
                select: 'name registrationNumber'
            });
            console.log(`Checked all ${allEvals.length} docs manually...`);
            allEvals.forEach(ev => {
                ev.terms.forEach(t => {
                    if (t.termId.toString() === termId) console.log("  MATCH FOUND in manual search!");
                });
            });
            await mongoose.disconnect();
            return;
        }

        const studentsMap = {};
        const weightageMap = {};

        evaluationDocs.forEach(evalDoc => {
            const evaluation = evalDoc.terms.find(t => t.termId.toString() === termId);
            if (!evaluation) return;

            evaluation.exams.forEach(exam => {
                const weight = (exam.examId && exam.examId.ExamWeightage) ? exam.examId.ExamWeightage : 0;
                weightageMap[exam.examName] = weight;

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
        });

        console.log("\n--- Students Found ---");
        Object.keys(studentsMap).forEach(sId => {
            const s = studentsMap[sId];
            console.log(`${s.registrationNumber}: ${s.name} - ${JSON.stringify(s.exams)}`);
        });

        await mongoose.disconnect();
    } catch (e) {
        console.error("Simulation failed:", e);
    }
}

simulate();
