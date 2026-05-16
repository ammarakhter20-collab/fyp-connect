const mongoose = require("mongoose");
require("dotenv").config();

// Access models directly from the server directory structure
const FYPTerm = require("./server/models/AdminModels/fypTerm");
const FypRegistration = require("./server/models/StudentModels/fypRegModel");
const Evaluation = require("./server/models/CoordinatorModels/EvaluateExamModel");
const CreateExamModel = require("./server/models/CoordinatorModels/ExamCreationModel");
const ExamType = require("./server/models/CoordinatorModels/ExamTypeModel");

// Helper to log with timestamp
const log = (msg) => console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);

async function runSetup() {
    try {
        log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        log("Connected!");

        // ---------------------------------------------------------
        // 1. Ensure Term 231-2 Exists
        // ---------------------------------------------------------
        let term2 = await FYPTerm.findOne({ sessionTerm: "231-2" });
        if (!term2) {
            log("Creating Term 231-2...");
            term2 = await FYPTerm.create({
                sessionTerm: "231-2",
                startDate: new Date("2024-02-01"),
                endDate: new Date("2024-06-30"),
                status: "activated"
            });
            log(`Created Term 231-2 (ID: ${term2._id})`);
        } else {
            log(`Found Term 231-2 (ID: ${term2._id})`);
        }

        // ---------------------------------------------------------
        // 2. Get Term 231-1 for Source Data
        // ---------------------------------------------------------
        const term1 = await FYPTerm.findOne({ sessionTerm: "231-1" });
        if (!term1) {
            throw new Error("Term 231-1 not found! Cannot promote groups.");
        }
        log(`Found Source Term 231-1 (ID: ${term1._id})`);

        // ---------------------------------------------------------
        // 3. Promote Groups from 231-1 to 231-2
        // ---------------------------------------------------------
        const part1Groups = await FypRegistration.find({
            term: term1._id,
            reqStatus: 'approved'
        });

        if (part1Groups.length === 0) {
            log("WARNING: No approved groups found in 231-1 to promote.");
        } else {
            log(`Found ${part1Groups.length} groups in 231-1. Checking for promotion...`);
        }

        let promotedCount = 0;
        for (const g1 of part1Groups) {
            // Check if this group is already in Term 2 (match by first student ID as a proxy)
            // Ideally we match by all members, but this is a fast script.
            const firstStudentId = g1.groupMembers[0] && g1.groupMembers[0]._id;
            if (!firstStudentId) continue;

            const existing = await FypRegistration.findOne({
                term: term2._id,
                'groupMembers._id': firstStudentId
            });

            if (!existing) {
                await FypRegistration.create({
                    groupMembers: g1.groupMembers,
                    selectedOption: g1.selectedOption,
                    selectedTechnology: g1.selectedTechnology,
                    topicData: g1.topicData,
                    selectedPlatform: g1.selectedPlatform,
                    reqStatus: 'approved',
                    user: g1.user,
                    term: term2._id,
                    partStatus: 'part-II',
                    assignedPanel: g1.assignedPanel
                });
                promotedCount++;
            }
        }
        log(`Promoted ${promotedCount} new groups to 231-2.`);

        // ---------------------------------------------------------
        // 4. Create Part II Exams (ExamType + CreateExamModel)
        // ---------------------------------------------------------
        const examsToCreate = [
            { name: "Attendance-II", weight: 40 }, // High weight for visibility
            { name: "Mid-II", weight: 20 },
            { name: "Final-II", weight: 40 }
        ];

        for (const ex of examsToCreate) {
            // Ensure ExamType exists
            let et = await ExamType.findOne({ examName: ex.name });
            if (!et) {
                et = await ExamType.create({
                    examName: ex.name,
                    shortCode: ex.name.toUpperCase().replace(/[^A-Z0-9]/g, ''),
                    examTypeFor: "Supervisor"
                });
                log(`Created ExamType: ${ex.name}`);
            }

            // Ensure Exam exists for Term 231-2
            // Note: CreateExamModel links to ExamType, doesn't store Name directly
            let ce = await CreateExamModel.findOne({
                ExamType: et._id,
                Term: term2._id
            });
            if (!ce) {
                ce = await CreateExamModel.create({
                    ExamType: et._id,
                    ExamWeightage: ex.weight,
                    Term: term2._id,
                    AnnouncedDate: new Date()
                });
                log(`Created Exam for Term: ${ex.name}`);
            } else {
                // Update weightage just in case
                if (ce.ExamWeightage !== ex.weight) {
                    ce.ExamWeightage = ex.weight;
                    await ce.save();
                    log(`Updated weightage for ${ex.name} to ${ex.weight}`);
                }
            }
        }

        // ---------------------------------------------------------
        // 5. Evaluate Exams (Assign Marks)
        // ---------------------------------------------------------
        const part2Groups = await FypRegistration.find({
            term: term2._id,
            partStatus: 'part-II'
        });
        log(`Processing evaluation for ${part2Groups.length} groups in 231-2...`);

        // Group by supervisor to minimize DB writes
        const supervisorGroupsMap = {};
        part2Groups.forEach(g => {
            if (g.selectedOption) {
                const supId = g.selectedOption.toString();
                if (!supervisorGroupsMap[supId]) supervisorGroupsMap[supId] = [];
                supervisorGroupsMap[supId].push(g);
            }
        });

        for (const [supId, groups] of Object.entries(supervisorGroupsMap)) {
            let evaluationDoc = await Evaluation.findOne({ supervisorId: supId });
            if (!evaluationDoc) {
                evaluationDoc = new Evaluation({ supervisorId: supId, terms: [] });
            }

            // Ensure Term Layer
            let termLayer = evaluationDoc.terms.find(t => t.termId.toString() === term2._id.toString());
            if (!termLayer) {
                evaluationDoc.terms.push({ termId: term2._id, exams: [] });
                termLayer = evaluationDoc.terms[evaluationDoc.terms.length - 1];
            }

            // For each exam type
            for (const ex of examsToCreate) {
                // Get ExamType
                const et = await ExamType.findOne({ examName: ex.name });
                if (!et) continue;

                // Get the CreatedExam ID
                const createdExam = await CreateExamModel.findOne({ ExamType: et._id, Term: term2._id });
                if (!createdExam) {
                    console.log(`Skipping ${ex.name} - Exam not created`);
                    continue;
                }

                // Ensure Exam Layer
                let examLayer = termLayer.exams.find(e => e.examId && e.examId.toString() === createdExam._id.toString());
                if (!examLayer) {
                    termLayer.exams.push({
                        examId: createdExam._id,
                        examName: ex.name,
                        examTypeFor: "FYP",
                        fypGroups: []
                    });
                    examLayer = termLayer.exams[termLayer.exams.length - 1];
                }

                // Add Groups and Marks
                for (const group of groups) {
                    let groupEvaluation = examLayer.fypGroups.find(g => g.groupId && g.groupId.toString() === group._id.toString());
                    if (!groupEvaluation) {
                        examLayer.fypGroups.push({
                            groupId: group._id,
                            students: []
                        });
                        groupEvaluation = examLayer.fypGroups[examLayer.fypGroups.length - 1];
                    }

                    // For each student in the group
                    for (const member of group.groupMembers) {
                        const studentId = member._id;
                        let studentEval = groupEvaluation.students.find(s => s.studentId && s.studentId.toString() === studentId.toString());

                        // Assign random marks 70-95
                        const marks = Math.floor(Math.random() * 26) + 70;

                        if (!studentEval) {
                            groupEvaluation.students.push({
                                studentId: studentId,
                                obtainedAverage: marks
                            });
                        } else {
                            // Update existing marks if needed (optional, here we overwrite)
                            studentEval.obtainedAverage = marks;
                        }
                    }
                }
            }
            await evaluationDoc.save();
        }

        log("Done! All evaluations updated/created.");
        log("---------------------------------------------------");
        log("PLEASE REFRESH THE PORTAL TO SEE THE COMBINED REPORT BUTTON.");
        log("---------------------------------------------------");

        await mongoose.disconnect();

    } catch (error) {
        log(`ERROR: ${error.message}`);
        if (error.errors) {
            console.log("Validation Errors:", JSON.stringify(error.errors, null, 2));
        } else {
            console.log(error);
        }
        process.exit(1);
    }
}

runSetup();
