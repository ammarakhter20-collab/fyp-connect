const mongoose = require('mongoose');
require('dotenv').config();

const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function checkEvaluations() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        const evals = await Evaluation.find({});
        console.log(`Total evaluation documents found: ${evals.length}`);

        if (evals.length > 0) {
            evals.forEach((ev, i) => {
                console.log(`\nEvaluation ${i + 1} (Supervisor: ${ev.supervisorId}):`);
                ev.terms.forEach(term => {
                    console.log(`  Term: ${term.termId}`);
                    term.exams.forEach(exam => {
                        console.log(`    Exam: ${exam.examName} (${exam.examTypeFor})`);
                        exam.fypGroups.forEach(group => {
                            console.log(`      Group: ${group.groupId}, Students: ${group.students.length}`);
                            group.students.forEach(student => {
                                console.log(`        Student: ${student.studentId}, Marks: ${student.obtainedAverage}`);
                            });
                        });
                    });
                });
            });
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
}

checkEvaluations();
