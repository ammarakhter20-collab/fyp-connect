const mongoose = require('mongoose');
require('dotenv').config();

const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const termId = "697b6a4856273c082e9ebdf1"; // Assuming this is the term ID

        const evals = await Evaluation.find({ "terms.termId": new mongoose.Types.ObjectId(termId) });
        console.log(`Found ${evals.length} Evaluation documents for term ${termId}`);
        evals.forEach(ev => {
            console.log(`Supervisor: ${ev.supervisorId}`);
            const term = ev.terms.find(t => t.termId.toString() === termId);
            if (term) {
                console.log(`  Exams: ${term.exams.map(e => e.examName).join(', ')}`);
                term.exams.forEach(ex => {
                    console.log(`    Exam: ${ex.examName}, Groups: ${ex.fypGroups.map(g => g.groupId).length}`);
                });
            }
        });
        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}
check();
