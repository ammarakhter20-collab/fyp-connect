const mongoose = require("mongoose");
const fs = require('fs');
require("dotenv").config();

// --- Models ---
const GenUser = require("./server/models/AdminModels/GenUserModel");
const FypRegistration = require("./server/models/StudentModels/fypRegModel");
const PanelDetails = require("./server/models/CoordinatorModels/PenalModel");
const FYPTerm = require("./server/models/AdminModels/fypTerm");
const ExamType = require("./server/models/CoordinatorModels/ExamTypeModel");
const CreateExamModel = require("./server/models/CoordinatorModels/ExamCreationModel");
const Evaluation = require("./server/models/CoordinatorModels/EvaluateExamModel");

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('script_output.log', msg + '\n');
}

const fastForwardResults = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        log("Connected to MongoDB for Fast Forwarding");

        // 0. CLEANUP: Remove invalid exams created by previous faulty runs
        const deleted = await CreateExamModel.deleteMany({ Term: { $exists: false } });
        if (deleted.deletedCount > 0) {
            log(`Cleaned up ${deleted.deletedCount} invalid CreateExamModel entries (missing Term).`);
        }

        // 1. Find Term 231-1
        const term = await FYPTerm.findOne({ sessionTerm: "231-1" });
        if (!term) {
            throw new Error("Term 231-1 not found! Please create it first.");
        }
        log(`Found Term: ${term.sessionTerm} (${term._id})`);

        // 2. Find ANY Existing Group and MOVE IT to this term (Force Migration)
        let groups = await FypRegistration.find({});
        if (groups.length === 0) {
            throw new Error("No FYP Groups found AT ALL. Cannot proceed.");
        }

        log(`Found ${groups.length} Total Groups. Moving them to Term 231-1 for testing.`);
        for (const g of groups) {
            g.term = term._id;
            await g.save();
        }

        // Re-fetch groups for safety
        groups = await FypRegistration.find({ term: term._id });

        // 3. Define Exams to Mark
        const examsToMark = ["Mid-I", "Attendance-I", "Final-I", "Orientation", "Proposal"];

        // 4. Ensure Term Evaluation Container Exists
        // Find all supervisors involved to create evaluation docs for each
        const supervisorIds = [...new Set(groups.map(g => g.selectedOption.toString()))];
        log(`Found ${supervisorIds.length} Supervisors to update.`);

        for (const supervisorId of supervisorIds) {

            let evaluation = await Evaluation.findOne({ supervisorId: supervisorId });
            if (!evaluation) {
                log(`Creating Evaluation container for Supervisor ${supervisorId}`);
                evaluation = new Evaluation({ supervisorId, terms: [] });
            }

            // 4a. FORCE RESYNC: Remove existing Term Layer to ensure fresh data
            const existingTermIndex = evaluation.terms.findIndex(t => t.termId.toString() === term._id.toString());
            if (existingTermIndex !== -1) {
                evaluation.terms.splice(existingTermIndex, 1);
                log(`Removed existing Term ${term.sessionTerm} data from Evaluation to force refresh.`);
            }

            // Find or Add Term Layer (Will always accept new now)
            let termLayer = evaluation.terms.find(t => t.termId.toString() === term._id.toString());
            if (!termLayer) {
                termLayer = { termId: term._id, exams: [] };
                evaluation.terms.push(termLayer);
                termLayer = evaluation.terms[evaluation.terms.length - 1];
            }

            // Process Each Group assigned to this Supervisor
            const supervisorGroups = groups.filter(g => g.selectedOption.toString() === supervisorId);

            for (const examName of examsToMark) {
                // Define Weightage based on Exam Name (Part I rules + Part II placeholders)
                let weightage = 0;
                if (examName === "Proposal") weightage = 20;
                else if (examName === "Attendance-I") weightage = 20;
                else if (examName === "Mid-I") weightage = 20;
                else if (examName === "Final-I") weightage = 40;
                else if (examName === "Attendance-II") weightage = 40;
                else if (examName === "Mid-II") weightage = 20;
                else if (examName === "Final-II") weightage = 40;
                else if (examName === "Orientation") weightage = 0; // Not graded
                else weightage = 10; // Default fallback

                // A. Find/Ensure Exam Info
                let examType = await ExamType.findOne({ examName: examName });
                if (!examType) {
                    log(`ExamType '${examName}' not found. Creating placeholder type.`);
                    examType = await ExamType.create({
                        examName: examName,
                        shortCode: examName.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000),
                        examTypeFor: "Supervisor"
                    });
                }

                // Check for CreatedExam
                let createdExam = await CreateExamModel.findOne({
                    ExamType: examType._id,
                    Term: term._id
                });

                if (!createdExam) {
                    log(`CreatedExam for '${examName}' in Term 231-1 not found. Creating one with Weightage ${weightage}...`);
                    createdExam = await CreateExamModel.create({
                        Term: term._id,
                        ExamType: examType._id,
                        examName: examName,
                        ExamWeightage: weightage,
                        AnnouncedDate: new Date(),
                        ReportDeadline: new Date(Date.now() + 86400000)
                    });
                } else {
                    // Update weightage if it exists but might be wrong (e.g. previous runs)
                    if (createdExam.ExamWeightage !== weightage) {
                        createdExam.ExamWeightage = weightage;
                        await createdExam.save();
                        log(`Updated Weightage for ${examName} to ${weightage}`);
                    }
                }


                // B. Add/Update Exam in Evaluation
                let examLayer = termLayer.exams.find(e => e.examId.toString() === createdExam._id.toString());
                if (!examLayer) {
                    examLayer = {
                        examId: createdExam._id,
                        examName: examName,
                        examTypeFor: "Supervisor",
                        fypGroups: []
                    };
                    termLayer.exams.push(examLayer);
                    examLayer = termLayer.exams[termLayer.exams.length - 1];
                }

                // C. Mark Students in Groups
                for (const group of supervisorGroups) {
                    let groupLayer = examLayer.fypGroups.find(g => g.groupId.toString() === group._id.toString());

                    let relatedPanel = await PanelDetails.findOne({
                        "department": group.groupMembers[0].department,
                        "term": term._id
                    });
                    const panelIdToUse = group.assignedPanel || (relatedPanel ? relatedPanel._id : new mongoose.Types.ObjectId());

                    if (!groupLayer) {
                        groupLayer = {
                            groupId: group._id,
                            panelId: panelIdToUse,
                            students: [],
                            approvedStatus: "approved"
                        };
                        examLayer.fypGroups.push(groupLayer);
                        groupLayer = examLayer.fypGroups[examLayer.fypGroups.length - 1];
                    }

                    // For each student in group
                    for (const member of group.groupMembers) {
                        const studentId = member._id;
                        let studentLayer = groupLayer.students.find(s => s.studentId.toString() === studentId.toString());

                        // Random percentage 70-95%
                        const percentage = (Math.floor(Math.random() * (95 - 70 + 1)) + 70) / 100;
                        const obtainedMarks = parseFloat((percentage * 100).toFixed(2));

                        if (!studentLayer) {
                            studentLayer = {
                                studentId: studentId,
                                marks: obtainedMarks,
                                obtainedAverage: obtainedMarks,
                                evaluationsByExaminers: [{
                                    examinerId: supervisorId,
                                    marks: obtainedMarks,
                                    totalWeightage: 100, // Normalized to 100
                                    feedback: "Auto-generated",
                                    evaluations: []
                                }]
                            };
                            groupLayer.students.push(studentLayer);
                        } else {
                            studentLayer.marks = obtainedMarks;
                            studentLayer.obtainedAverage = obtainedMarks;
                            studentLayer.evaluationsByExaminers = [{
                                examinerId: supervisorId,
                                marks: obtainedMarks,
                                totalWeightage: 100, // Normalized to 100
                                feedback: "Auto-generated (Updated)",
                                evaluations: []
                            }];
                        }
                    }
                }
            }

            evaluation.markModified('terms');
            // DEBUG: Check if object is actually updated in memory
            log("DEBUG: Evaluation before save: " + JSON.stringify(evaluation.terms[0].exams[0].fypGroups[0].students[0]));

            await evaluation.save();
            log(`Updated evaluation for Supervisor ${supervisorId}`);
        }

        // 5. Update Panels to "Marked"
        const panels = await PanelDetails.find({ term: term._id });
        for (const panel of panels) {
            let updated = false;
            // Update panel status to 'marked' for all members to be safe
            panel.PanelMembers.forEach(pm => {
                // Force update
                pm.evaluationStatus = "marked";
                updated = true;
            });
            if (updated) {
                await panel.save();
                log(`Updated Panel ${panel.panelCode} status to 'marked'.`);
            }
        }

        log("Fast Forward Complete!");
        process.exit(0);

    } catch (error) {
        console.error("Fast Forward Error:", error);
        fs.appendFileSync('script_output.log', 'ERROR: ' + error.stack + '\n');
        process.exit(1);
    }
};

fastForwardResults();
