const mongoose = require('mongoose');
require('dotenv').config();

const FYPTerm = require('./server/models/AdminModels/fypTerm');
const ExamType = require('./server/models/CoordinatorModels/ExamTypeModel');
const GenUser = require('./server/models/AdminModels/GenUserModel');
const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');
const FypRegistration = require('./server/models/StudentModels/fypRegModel');
const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const termId = "697b64c756273c082e9eba85";

        const evals = await Evaluation.find({ "terms.termId": termId })
            .populate({
                path: 'terms.exams.examId',
                select: 'ExamWeightage ExamType',
                populate: {
                    path: 'ExamType',
                    select: 'examName examTypeFor'
                }
            });

        let proposalFound = false;
        let att1Found = false;

        evals.forEach(ev => {
            const term = ev.terms.find(t => t.termId.toString() === termId);
            if (!term) return;

            term.exams.forEach(ex => {
                if (ex.examName === "Proposal" || ex.examName === "Proposal ") {
                    console.log(`FOUND PROPOSAL: '${ex.examName}'`);
                    if (ex.examId) {
                        console.log(`  examId: ${ex.examId._id}`);
                        console.log(`  Weight: ${ex.examId.ExamWeightage}`);
                        console.log(`  ExamType: ${JSON.stringify(ex.examId.ExamType)}`);
                    } else {
                        console.log("  examId is NULL/Missing");
                    }
                    proposalFound = true;
                }
                if (ex.examName === "Attendance-I") {
                    console.log(`FOUND ATTENDANCE-I: '${ex.examName}'`);
                    if (ex.examId) {
                        console.log(`  examId: ${ex.examId._id}`);
                        console.log(`  Weight: ${ex.examId.ExamWeightage}`);
                    } else {
                        console.log("  examId is NULL/Missing");
                    }
                    att1Found = true;
                }
            });
        });

        if (!proposalFound) console.log("PROPOSAL NOT FOUND IN ANY EVALUATION");
        if (!att1Found) console.log("ATTENDANCE-I NOT FOUND IN ANY EVALUATION");

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}
check();
