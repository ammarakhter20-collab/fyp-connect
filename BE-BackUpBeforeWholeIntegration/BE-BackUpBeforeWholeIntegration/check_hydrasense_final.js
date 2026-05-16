const mongoose = require('mongoose');
require('dotenv').config();

const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const groupId = "697b69da56273c082e9ebdea";

        const evalDoc = await Evaluation.findOne({ "terms.exams.fypGroups.groupId": new mongoose.Types.ObjectId(groupId) });

        if (evalDoc) {
            console.log("\n--- Evaluation Document Found ---");
            console.log(`Supervisor: ${evalDoc.supervisorId}`);
            evalDoc.terms.forEach(t => {
                console.log(`\nTerm ID: ${t.termId}`);
                t.exams.forEach(ex => {
                    const group = ex.fypGroups.find(g => g.groupId.toString() === groupId);
                    if (group) {
                        console.log(`Exam: ${ex.examName} (${ex.examId})`);
                        group.students.forEach(s => {
                            console.log(`\n  Student: ${s.studentId}`);
                            console.log(`  Obtained Average: ${s.obtainedAverage}`);
                            console.log(`  Examiners Entry Count: ${s.evaluationsByExaminers.length}`);
                            s.evaluationsByExaminers.forEach((evm, idx) => {
                                console.log(`    Entry ${idx + 1}: Examiner ${evm.examinerId}`);
                                console.log(`      Raw Marks: ${evm.marks}`);
                                console.log(`      Evaluations Len: ${evm.evaluations?.length || 0}`);
                                if (evm.evaluations && evm.evaluations.length > 0) {
                                    evm.evaluations.forEach((ce, cidx) => {
                                        console.log(`        CLO ${cidx}: Obtained %: ${ce.obtainedCLOPercentage}`);
                                    });
                                }
                            });
                        });
                    }
                });
            });
        } else {
            console.log("No Evaluation document found for this group ID.");
        }
        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}
check();
