const mongoose = require('mongoose');
require('dotenv').config();

const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');
const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');
const ExamType = require('./server/models/CoordinatorModels/ExamTypeModel');
const FYPTerm = require('./server/models/AdminModels/fypTerm');

async function syncExams() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB...");

        // 1. Get all Active Exams and build a map: Name -> ID
        const activeExams = await CreateExam.find().populate('ExamType');
        const examMap = {}; // "ExamName" -> examId (ObjectId)

        activeExams.forEach(ex => {
            if (ex.ExamType && ex.ExamType.examName) {
                examMap[ex.ExamType.examName] = ex._id;
                console.log(`Active Exam: ${ex.ExamType.examName} -> ${ex._id}`);
                // Note: If you have same exam name in multiple terms, this map might need to be "Name_TermId" -> ID
                // But usually Names are unique per Term or we can try to match by Name AND Term if needed.
                // For now assuming Name is unique enough or we match strictly within the term.
            }
        });

        // Better Map: "ExamName_TermId" -> ID
        const examTermMap = {};
        activeExams.forEach(ex => {
            if (ex.ExamType && ex.ExamType.examName && ex.Term) {
                const key = `${ex.ExamType.examName}_${ex.Term.toString()}`;
                examTermMap[key] = ex._id;
            }
        });

        // 2. Iterate Evaluations
        const evals = await Evaluation.find({});
        console.log(`Checking ${evals.length} evaluation documents...`);

        for (const doc of evals) {
            let modified = false;

            for (const term of doc.terms) {
                for (const exam of term.exams) {
                    const key = `${exam.examName}_${term.termId.toString()}`;
                    const correctId = examTermMap[key]; // Try term-specific match first

                    // Fallback to strict name match if term match fails (in case Term ID mismatch still exists or just to be safe)
                    // But we should rely on keys. 
                    // Let's use examMap (Name only) as fallback if we trust names are unique enough or we just want to fix broken ones.

                    // Current check
                    if (correctId) {
                        if (!exam.examId || exam.examId.toString() !== correctId.toString()) {
                            console.log(`  Fixing Exam ID for '${exam.examName}' in Term ${term.termId}`);
                            console.log(`    Old: ${exam.examId}, New: ${correctId}`);
                            exam.examId = correctId;
                            modified = true;
                        }
                    } else {
                        // Try fallback if correctId not found by key (maybe term ID differs slightly?)
                        if (examMap[exam.examName]) {
                            const fallbackId = examMap[exam.examName];
                            if (!exam.examId || exam.examId.toString() !== fallbackId.toString()) {
                                console.log(`  Fixing Exam ID (Fallback Name Match) for '${exam.examName}'`);
                                console.log(`    Old: ${exam.examId}, New: ${fallbackId}`);
                                exam.examId = fallbackId;
                                modified = true;
                            }
                        } else {
                            console.log(`  WARNING: No active exam found for '${exam.examName}'`);
                        }
                    }
                }
            }

            if (modified) {
                doc.markModified('terms');
                await doc.save();
                console.log(`  Saved Document ${doc._id}`);
            }
        }

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

syncExams();
