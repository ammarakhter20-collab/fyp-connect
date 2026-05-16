const mongoose = require('mongoose');
require('dotenv').config();

require('./server/models/AdminModels/fypTerm');
require('./server/models/CoordinatorModels/ExamTypeModel');
require('./server/models/StudentModels/fypRegModel');
require('./server/models/AdminModels/GenUserModel');
const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');
const CLOForExam = require("./server/models/CoordinatorModels/CLOForExamModel");
const Question = require("./server/models/CoordinatorModels/QuesForCLOModel");
const PanelDetails = require("./server/models/CoordinatorModels/PenalModel");
const ExamType = require("./server/models/CoordinatorModels/ExamTypeModel");

// Helper Functions COPY from EvaluateExamCont.js (since they are not exported)
// Simplified versions for recalculation context

const getQuestionDetails = async (questionId) => {
    // Check local cache or fetch? 
    // For script, just fetch if needed, but calculateAverageCLOPercentage relies on PRE-CALCULATED data in evaluations.
    // So we don't need this.
    return null;
};

// ... calculateAverageCLOPercentage COPY ...
// Wait, we need the Exact Logic we just put in the file.
const calculateAverageCLOPercentage = (student) => {
    const cloStats = new Map();

    student.evaluationsByExaminers?.forEach((examiner) => {
        examiner.evaluations?.forEach((cloForExam) => {
            const firstCloEval = cloForExam.cloEvaluations?.[0];
            if (firstCloEval) {
                const cloId = firstCloEval.cloId.toString();
                if (!cloStats.has(cloId)) {
                    cloStats.set(cloId, { sum: 0, count: 0, total: 0 });
                }
                const stats = cloStats.get(cloId);
                stats.sum += (cloForExam.obtainedCLOPercentage || 0);
                stats.total += (cloForExam.totalCLOPercentage || 0);
                stats.count += 1;
            }
        });
    });

    return Array.from(cloStats.entries()).map(([cloId, stats]) => ({
        cloId: cloId,
        averageCLOPercentage: stats.sum / (stats.count || 1),
        totalCLOPercentage: stats.total / (stats.count || 1),
    }));
};

const recalculateAverages = (term, termId, examId) => {
    const foundT = term.terms.find(t => t.termId.toString() === termId.toString());
    if (!foundT) return;

    let curEx = foundT.exams.find(e => e.examId.toString() === examId.toString());
    if (!curEx) {
        // Try name fallback? Script should iterate correctly.
        return;
    }

    console.log(`Recalculating for exam: ${curEx.examName}`);

    curEx.fypGroups?.forEach(g => {
        g.students?.forEach(s => {
            let tot = 0;
            s.evaluationsByExaminers?.forEach(ex => {
                let examMarks = 0;
                if (ex.evaluations && ex.evaluations.length > 0) {
                    examMarks = ex.evaluations.reduce((acc, cloForExam) => {
                        return acc + (cloForExam.obtainedCLOPercentage || 0);
                    }, 0);
                } else {
                    examMarks = Number(ex.marks) || 0;
                }
                tot += examMarks;
            });

            const examinerCount = s.evaluationsByExaminers?.length || 1;
            s.obtainedAverage = tot / examinerCount;
            s.obtainedAverageofCLO = calculateAverageCLOPercentage(s);

            console.log(`Student ${s.studentId}: Marks=${s.obtainedAverage}, CLO=${JSON.stringify(s.obtainedAverageofCLO)}`);
        });
    });
};


async function runRecalculation() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB.");

        const allOrgs = await Evaluation.find({});
        console.log(`Found ${allOrgs.length} Evaluation records.`);

        for (const doc of allOrgs) {
            let modified = false;
            for (const t of doc.terms) {
                for (const ex of t.exams) {
                    // Call Recalc
                    recalculateAverages(doc, t.termId, ex.examId);
                    modified = true;
                }
            }
            if (modified) {
                console.log(`Saving document ${doc._id}...`);
                doc.markModified('terms');
                await doc.save();
            }
        }

        console.log("Recalculation complete.");
        await mongoose.disconnect();
    } catch (e) {
        console.error("Error:", e);
    }
}

runRecalculation();
