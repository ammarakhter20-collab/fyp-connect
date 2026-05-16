const mongoose = require('mongoose');
require('dotenv').config();

const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function debug() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const evals = await Evaluation.find({ "terms.exams.examName": /Attendance/i });

        for (const ev of evals) {
            console.log("-----------------------------------------");
            console.log(`Supervisor: ${ev.supervisorId}`);
            for (const term of ev.terms) {
                console.log(`  Term: ${term.termId}`);
                for (const exam of term.exams) {
                    if (!exam.examName.includes('Attendance')) continue;
                    console.log(`    Exam: ${exam.examName} (ID: ${exam.examId})`);
                    for (const group of exam.fypGroups) {
                        console.log(`      Group: ${group.groupId}`);
                        for (const student of group.students) {
                            console.log(`        Student: ${student.studentId}`);
                            console.log(`          ObtainedAverage: ${student.obtainedAverage} (Type: ${typeof student.obtainedAverage})`);
                            for (const exm of student.evaluationsByExaminers) {
                                console.log(`          Examiner: ${exm.examinerId}`);
                                console.log(`            Marks: ${exm.marks} (Type: ${typeof exm.marks})`);
                                console.log(`            Weightage: ${exm.totalWeightage}`);
                            }
                        }
                    }
                }
            }
        }
        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}

debug();
