const mongoose = require('mongoose');
require('dotenv').config();

const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const groupId = "697b69da56273c082e9ebdea";

        const evals = await Evaluation.find({
            "terms.exams.fypGroups.groupId": new mongoose.Types.ObjectId(groupId)
        });

        console.log(`Evaluations found: ${evals.length}`);
        evals.forEach(ev => {
            console.log(`\nSupervisor ID: ${ev.supervisorId}`);
            ev.terms.forEach(t => {
                console.log(`Term ID: ${t.termId}`);
                t.exams.forEach(ex => {
                    const g = ex.fypGroups.find(grp => grp.groupId.toString() === groupId);
                    if (g) {
                        console.log(`  Exam Name: ${ex.examName} (Exam ID: ${ex.examId})`);
                        g.students.forEach(s => {
                            console.log(`    Student ID: ${s.studentId}`);
                            console.log(`    Obtained Average: ${s.obtainedAverage}`);
                            s.evaluationsByExaminers.forEach(eb => {
                                console.log(`      Examiner: ${eb.examinerId}`);
                                console.log(`      Raw Marks: ${eb.marks}`);
                                console.log(`      Evaluations Array Length: ${eb.evaluations?.length || 0}`);
                                if (eb.evaluations && eb.evaluations.length > 0) {
                                    eb.evaluations.forEach(evl => {
                                        console.log(`        CLO Obtained %: ${evl.obtainedCLOPercentage}`);
                                    });
                                }
                            });
                        });
                    }
                });
            });
        });

        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}

check();
