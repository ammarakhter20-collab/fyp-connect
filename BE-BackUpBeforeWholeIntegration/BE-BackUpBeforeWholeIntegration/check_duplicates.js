const mongoose = require('mongoose');
require('dotenv').config();

const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const groupId = "697b69da56273c082e9ebdea";

        const evalDoc = await Evaluation.findOne({ "terms.exams.fypGroups.groupId": new mongoose.Types.ObjectId(groupId) });

        if (evalDoc) {
            console.log("\n--- Term and Exam IDs in Evaluation Document ---");
            evalDoc.terms.forEach(t => {
                console.log(`Term: ${t.termId}`);
                t.exams.forEach(ex => {
                    const group = ex.fypGroups.find(g => g.groupId.toString() === groupId);
                    if (group) {
                        console.log(`  - Exam Name: ${ex.examName}`);
                        console.log(`    Exam ID: ${ex.examId}`);
                        console.log(`    Obtained Average: ${group.students[0]?.obtainedAverage}`);
                    }
                });
            });
        }
        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}
check();
