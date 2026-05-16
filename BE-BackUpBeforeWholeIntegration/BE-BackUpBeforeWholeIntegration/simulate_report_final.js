const mongoose = require('mongoose');
require('dotenv').config();

require('./server/models/AdminModels/fypTerm');
require('./server/models/CoordinatorModels/ExamTypeModel');
require('./server/models/StudentModels/fypRegModel');
require('./server/models/AdminModels/GenUserModel');
const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function simulate() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const termId = "697b64c756273c082e9eba85"; // Term 121

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

        const allExams = [];
        evaluationDocs.forEach(doc => {
            const t = doc.terms.find(termEntry => termEntry.termId.toString() === termId);
            if (t && t.exams) {
                allExams.push(...t.exams);
            }
        });

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

        console.log("\n--- Consolidated Students ---");
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
