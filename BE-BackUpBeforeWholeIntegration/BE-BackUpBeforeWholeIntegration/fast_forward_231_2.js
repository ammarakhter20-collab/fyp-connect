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
    fs.appendFileSync('script_output_231_2.log', msg + '\n');
}

const fastForwardPart2 = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        log("✅ Connected to MongoDB for Part II Fast Forward");

        // 1. Find or Create Term 231-2
        let term231_2 = await FYPTerm.findOne({ sessionTerm: "231-2" });
        if (!term231_2) {
            log("⚠️  Term 231-2 not found. Creating it...");
            term231_2 = new FYPTerm({
                sessionTerm: "231-2",
                status: "activated",
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await term231_2.save();
            log(`✅ Term 231-2 created: ${term231_2._id}`);
        } else {
            log(`✅ Found Term 231-2: ${term231_2._id}`);
        }

        // 2. Find Term 231-1
        const term231_1 = await FYPTerm.findOne({ sessionTerm: "231-1" });
        if (!term231_1) {
            throw new Error("❌ Term 231-1 not found! Cannot proceed.");
        }
        log(`✅ Found Term 231-1: ${term231_1._id}`);

        // 3. Find Groups in 231-1
        const part1Groups = await FypRegistration.find({
            term: term231_1._id,
            reqStatus: 'approved'
        });

        if (part1Groups.length === 0) {
            throw new Error("❌ No approved groups found in 231-1! Run fast_forward_231_1.js first.");
        }

        log(`✅ Found ${part1Groups.length} approved groups in Part I`);

        // 4. Check if groups already promoted
        const existingPart2Groups = await FypRegistration.find({
            term: term231_2._id,
            partStatus: 'part-II'
        });

        let part2Groups = [];

        if (existingPart2Groups.length > 0) {
            log(`ℹ️  ${existingPart2Groups.length} groups already promoted to Part II. Using existing groups.`);
            part2Groups = existingPart2Groups;
        } else {
            log("📋 Promoting groups from Part I to Part II...");
            // Promote groups
            for (const part1Group of part1Groups) {
                const part2Group = new FypRegistration({
                    groupMembers: part1Group.groupMembers,
                    selectedOption: part1Group.selectedOption,
                    selectedTechnology: part1Group.selectedTechnology,
                    topicData: part1Group.topicData,
                    selectedPlatform: part1Group.selectedPlatform,
                    reqStatus: 'approved',
                    user: part1Group.user,
                    term: term231_2._id,
                    partStatus: 'part-II',
                    assignedPanel: part1Group.assignedPanel
                });
                await part2Group.save();
                part2Groups.push(part2Group);
            }
            log(`✅ Promoted ${part2Groups.length} groups to Part II`);
        }

        // 5. Define Part II Exams
        const part2Exams = [
            { name: "Attendance-II", weightage: 40 },
            { name: "Mid-II", weightage: 20 },
            { name: "Final-II", weightage: 40 }
        ];

        // 6. Ensure Term Evaluation Container Exists
        const supervisorIds = [...new Set(part2Groups.map(g => g.selectedOption.toString()))];
        log(`📋 Processing ${supervisorIds.length} Supervisors`);

        for (const supervisorId of supervisorIds) {
            let evaluation = await Evaluation.findOne({ supervisorId: supervisorId });
            if (!evaluation) {
                log(`  Creating Evaluation container for Supervisor ${supervisorId}`);
                evaluation = new Evaluation({ supervisorId, terms: [] });
            }

            // Find or Add Term Layer for 231-2
            let termLayer = evaluation.terms.find(t => t.termId.toString() === term231_2._id.toString());
            if (!termLayer) {
                termLayer = { termId: term231_2._id, exams: [] };
                evaluation.terms.push(termLayer);
                termLayer = evaluation.terms[evaluation.terms.length - 1];
                log(`  Created term layer for 231-2`);
            } else {
                log(`  Term layer for 231-2 already exists`);
            }

            // Process Each Group assigned to this Supervisor
            const supervisorGroups = part2Groups.filter(g => g.selectedOption.toString() === supervisorId);

            for (const examConfig of part2Exams) {
                const examName = examConfig.name;
                const weightage = examConfig.weightage;

                // A. Find/Ensure Exam Info
                let examType = await ExamType.findOne({ examName: examName });
                if (!examType) {
                    log(`  Creating ExamType: ${examName}`);
                    examType = new ExamType({ examName: examName });
                    await examType.save();
                }

                let createdExam = await CreateExamModel.findOne({
                    ExamName: examName,
                    Term: term231_2._id
                });

                if (!createdExam) {
                    log(`  Creating Exam: ${examName} for Term 231-2`);
                    createdExam = new CreateExamModel({
                        ExamName: examName,
                        ExamWeightage: weightage,
                        Term: term231_2._id,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                    await createdExam.save();
                } else {
                    // Update weightage if different
                    if (createdExam.ExamWeightage !== weightage) {
                        createdExam.ExamWeightage = weightage;
                        await createdExam.save();
                        log(`  Updated ${examName} weightage to ${weightage}%`);
                    }
                }

                // B. Find or Add Exam Layer in Evaluation
                let examLayer = termLayer.exams.find(e => e.examId && e.examId.toString() === createdExam._id.toString());
                if (!examLayer) {
                    examLayer = { examId: createdExam._id, examName: examName, fypGroups: [] };
                    termLayer.exams.push(examLayer);
                    examLayer = termLayer.exams[termLayer.exams.length - 1];
                    log(`  Added exam layer for ${examName}`);
                }

                // C. Add Groups to Exam Layer
                for (const group of supervisorGroups) {
                    let groupInExam = examLayer.fypGroups.find(g => g.fypGroupId && g.fypGroupId.toString() === group._id.toString());
                    if (!groupInExam) {
                        groupInExam = { fypGroupId: group._id, students: [] };
                        examLayer.fypGroups.push(groupInExam);
                        groupInExam = examLayer.fypGroups[examLayer.fypGroups.length - 1];
                    }

                    // D. Add Students with Random Marks
                    for (const member of group.groupMembers) {
                        const studentId = member._id;
                        let studentInGroup = groupInExam.students.find(s => s.studentId && s.studentId.toString() === studentId.toString());

                        // Generate random marks (70-95)
                        const randomMarks = Math.floor(Math.random() * 26) + 70;

                        if (!studentInGroup) {
                            studentInGroup = {
                                studentId: studentId,
                                obtainedAverage: randomMarks
                            };
                            groupInExam.students.push(studentInGroup);
                        } else {
                            studentInGroup.obtainedAverage = randomMarks;
                        }
                    }
                }
            }

            await evaluation.save();
            log(`✅ Updated evaluation for Supervisor ${supervisorId}`);
        }

        log("\n🎉 Part II Fast Forward Complete!");
        log("================================");
        log(`✅ Term 231-2 ready`);
        log(`✅ ${part2Groups.length} groups promoted`);
        log(`✅ ${part2Exams.length} exams created with marks`);
        log("\n📝 Next Steps:");
        log("1. Go to Results page");
        log("2. Select Term: 231-1");
        log("3. Select 'Overall Result List' or 'Portal Result List'");
        log("4. Click 'Done'");
        log("5. Click 'View Combined Part I + Part II Report' button!");

        await mongoose.disconnect();
        log("\n✅ Disconnected from MongoDB");

    } catch (error) {
        log(`❌ Error: ${error.message}`);
        log(error.stack);
        process.exit(1);
    }
};

fastForwardPart2();
