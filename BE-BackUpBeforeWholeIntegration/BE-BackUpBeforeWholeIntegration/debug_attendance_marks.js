const mongoose = require('mongoose');
require('dotenv').config();

const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function checkAttendanceMarks() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        const evals = await Evaluation.find({ "terms.exams.examName": /Attendance/i });
        console.log(`Evaluation documents with Attendance found: ${evals.length}`);

        evals.forEach((ev, i) => {
            console.log(`\nEvaluation ${i + 1} (Supervisor: ${ev.supervisorId}):`);
            ev.terms.forEach(term => {
                term.exams.filter(exam => exam.examName.includes('Attendance')).forEach(exam => {
                    console.log(`    Exam: ${exam.examName}`);
                    exam.fypGroups.forEach(group => {
                        console.log(`      Group: ${group.groupId}`);
                        group.students.forEach(student => {
                            console.log(`        Student: ${student.studentId}`);
                            console.log(`          Obtained Average: ${student.obtainedAverage}`);
                            student.evaluationsByExaminers.forEach(exm => {
                                console.log(`          Examiner: ${exm.examinerId}, Marks: ${exm.marks}, Weightage: ${exm.totalWeightage}`);
                            });
                        });
                    });
                });
            });
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
}

checkAttendanceMarks();
