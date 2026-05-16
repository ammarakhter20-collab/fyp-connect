const mongoose = require('mongoose');
require('dotenv').config();

const FypRegistration = require('./server/models/StudentModels/fypRegModel');
const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const group = await FypRegistration.findOne({ fypTitle: /hydrasense/i }).populate('groupMembers');
        if (!group) {
            console.log("Group hydrasense not found");
            return;
        }

        console.log(`Group Found: ${group.fypTitle} (_id: ${group._id})`);
        console.log(`Members: ${group.groupMembers.map(m => m.name + " (" + m.registrationNumber + ")").join(", ")}`);

        const evals = await Evaluation.find({
            "terms.exams.fypGroups.groupId": group._id
        });

        console.log(`Evaluations found: ${evals.length}`);
        evals.forEach(ev => {
            console.log(`Supervisor: ${ev.supervisorId}`);
            ev.terms.forEach(t => {
                t.exams.forEach(ex => {
                    const g = ex.fypGroups.find(grp => grp.groupId.toString() === group._id.toString());
                    if (g) {
                        console.log(`  Exam: ${ex.examName}`);
                        g.students.forEach(s => {
                            console.log(`    Student ID: ${s.studentId}`);
                            console.log(`    Obtained Average: ${s.obtainedAverage}`);
                            s.evaluationsByExaminers.forEach(e => {
                                console.log(`      Examiner: ${e.examinerId}, Marks: ${e.marks}`);
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
