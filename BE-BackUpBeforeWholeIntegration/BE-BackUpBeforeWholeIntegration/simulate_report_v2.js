const mongoose = require('mongoose');
require('dotenv').config();

require('./server/models/AdminModels/fypTerm');
require('./server/models/CoordinatorModels/ExamTypeModel');
const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function simulate() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log("--- Listing ALL Evaluation Documents ---");
        const allEvals = await Evaluation.find({});
        console.log(`Total Docs: ${allEvals.length}`);

        allEvals.forEach(ev => {
            console.log(`\nDoc ID: ${ev._id}, Supervisor: ${ev.supervisorId}`);
            ev.terms.forEach(t => {
                console.log(`  Term ID: ${t.termId}`);
                t.exams.forEach(ex => {
                    console.log(`    Exam: ${ex.examName}, Groups: ${ex.fypGroups.map(g => g.groupId.toString()).join(', ')}`);
                });
            });
        });

        await mongoose.disconnect();
    } catch (e) {
        console.error("Simulation failed:", e);
    }
}

simulate();
