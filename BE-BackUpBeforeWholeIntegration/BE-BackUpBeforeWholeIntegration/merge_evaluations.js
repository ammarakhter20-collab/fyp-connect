const mongoose = require('mongoose');
require('dotenv').config();

// Ensure all models are loaded
require('./server/models/AdminModels/fypTerm');
require('./server/models/CoordinatorModels/ExamTypeModel');
const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');
const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB for cleanup...");

        // 1. Get all current exams to match correct IDs
        const latestExams = await CreateExam.find().populate('ExamType');
        const examMap = {}; // name_termId -> examId
        latestExams.forEach(ex => {
            if (ex.ExamType && ex.Term) {
                const key = `${ex.ExamType.examName}_${ex.Term._id || ex.Term}`;
                examMap[key] = ex._id;
            }
        });

        const evals = await Evaluation.find({});
        for (const evalDoc of evals) {
            let modified = false;

            for (const term of evalDoc.terms) {
                const examGroups = {}; // name -> array of exam entries

                term.exams.forEach(ex => {
                    if (!examGroups[ex.examName]) examGroups[ex.examName] = [];
                    examGroups[ex.examName].push(ex);
                });

                for (const examName in examGroups) {
                    const instances = examGroups[examName];

                    const targetKey = `${examName}_${term.termId}`;
                    const latestId = examMap[targetKey];

                    if (instances.length > 1) {
                        console.log(`Found ${instances.length} instances of ${examName} in term ${term.termId} for supervisor ${evalDoc.supervisorId}`);

                        // Identify the "master" instance
                        let masterIndex = instances.findIndex(ins => ins.examId.toString() === latestId?.toString());
                        if (masterIndex === -1) masterIndex = 0;

                        const master = instances[masterIndex];

                        // Merge others into master
                        for (let i = 0; i < instances.length; i++) {
                            if (i === masterIndex) continue;
                            const other = instances[i];

                            other.fypGroups.forEach(otherGrp => {
                                let masterGrp = master.fypGroups.find(g => g.groupId.toString() === otherGrp.groupId.toString());
                                if (!masterGrp) {
                                    master.fypGroups.push(otherGrp);
                                } else {
                                    otherGrp.students.forEach(otherStd => {
                                        let masterStd = masterGrp.students.find(s => s.studentId.toString() === otherStd.studentId.toString());
                                        if (!masterStd) {
                                            masterGrp.students.push(otherStd);
                                        } else {
                                            if ((otherStd.obtainedAverage || 0) > (masterStd.obtainedAverage || 0)) {
                                                console.log(`  Merging marks for student ${otherStd.studentId}: ${masterStd.obtainedAverage} -> ${otherStd.obtainedAverage}`);
                                                masterStd.obtainedAverage = otherStd.obtainedAverage;
                                                masterStd.evaluationsByExaminers = otherStd.evaluationsByExaminers;
                                            }
                                        }
                                    });
                                }
                            });

                            term.exams = term.exams.filter(ex => ex !== other);
                            modified = true;
                        }

                        if (latestId && master.examId.toString() !== latestId.toString()) {
                            console.log(`  Syncing ${examName} ID: ${master.examId} -> ${latestId}`);
                            master.examId = latestId;
                            modified = true;
                        }
                    } else if (instances.length === 1) {
                        const master = instances[0];
                        if (latestId && master.examId.toString() !== latestId.toString()) {
                            console.log(`Syncing single ${examName} ID: ${master.examId} -> ${latestId}`);
                            master.examId = latestId;
                            modified = true;
                        }
                    }
                }
            }

            if (modified) {
                console.log(`Saving updated Evaluation for supervisor ${evalDoc.supervisorId}`);
                evalDoc.markModified('terms');
                await evalDoc.save();
            }
        }

        console.log("Cleanup finished.");
        await mongoose.disconnect();
    } catch (e) {
        console.error("Cleanup failed:", e);
    }
}

cleanup();
