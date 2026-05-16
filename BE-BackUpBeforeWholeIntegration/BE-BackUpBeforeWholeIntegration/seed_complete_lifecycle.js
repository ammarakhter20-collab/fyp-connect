const mongoose = require("mongoose");
require("dotenv").config();

// --- Models ---
const GenUser = require("./server/models/AdminModels/GenUserModel");
const FypRegistration = require("./server/models/StudentModels/fypRegModel");
const PanelDetails = require("./server/models/CoordinatorModels/PenalModel");
const ExamAssignment = require("./server/models/CoordinatorModels/ExamAssignment");
const Technology = require("./server/models/CoordinatorModels/Technology");
const Platform = require("./server/models/CoordinatorModels/PlatformModel");

const Department = require("./server/models/AdminModels/department");
const Program = require("./server/models/AdminModels/program");
const FYPTerm = require("./server/models/AdminModels/fypTerm");

// Assessment Models
const ManageCLO = require("./server/models/CoordinatorModels/CLOsModel");
const QuestionsForCLO = require("./server/models/CoordinatorModels/QuesForCLOModel");
const CLOForExam = require("./server/models/CoordinatorModels/CLOForExamModel"); // Definition for exam
const CreateExamModel = require("./server/models/CoordinatorModels/CreateExamModel"); // Exam Template Names
const ExamType = require("./server/models/CoordinatorModels/ExamTypeModel");
const Evaluation = require("./server/models/CoordinatorModels/EvaluateExamModel");

const seedLifecycle = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        // 1. Fetch Users
        const student = await GenUser.findOne({ email: "student@test.com" });
        const supervisor = await GenUser.findOne({ email: "faculty@test.com" });
        const coordinator = await GenUser.findOne({ email: "coordinator@test.com" });
        const member1 = await GenUser.findOne({ email: "member1@test.com" });
        const member2 = await GenUser.findOne({ email: "member2@test.com" });

        if (!student || !supervisor || !coordinator) {
            console.error("Missing required users. Run create_test_data.js first.");
            process.exit(1);
        }

        // 2. Fetch/Create Basic Entities
        const term = await FYPTerm.findOne({ sessionTerm: "Fall-2025" });
        const dept = await Department.findOne({ departmentName: "Computer Science" });
        const prog = await Program.findOne({ programTitle: "BSCS" });

        let tech = await Technology.findOne({ techName: "Test Tech" });
        if (!tech) tech = await Technology.create({ techName: "Test Tech", user: coordinator._id });

        let plat = await Platform.findOne({ platformName: "Test Platform" });
        if (!plat) plat = await Platform.create({ platformName: "Test Platform", user: coordinator._id });

        // 3. Setup Assessment / CLOs
        // Create Questions
        let q1 = await QuestionsForCLO.findOne({ shortCode: "Q-TEST-1" });
        if (!q1) q1 = await QuestionsForCLO.create({ shortCode: "Q-TEST-1", question: "Explain the architecture", marks: 5 });

        let q2 = await QuestionsForCLO.findOne({ shortCode: "Q-TEST-2" });
        if (!q2) q2 = await QuestionsForCLO.create({ shortCode: "Q-TEST-2", question: "Demonstrate the functionality", marks: 5 });

        // Create CLO
        let clo1 = await ManageCLO.findOne({ CLOCode: "CLO-TEST-1" });
        if (!clo1) {
            clo1 = await ManageCLO.create({
                CLOCode: "CLO-TEST-1",
                Title: "System Design",
                Program: prog._id,
                Questions: [q1._id, q2._id]
            });
        }

        // Create CLOForExam (The wrapper used in evaluations)
        // We typically create one per Exam/Program context, but for seeding we'll make a generic one
        let cloForExam = await CLOForExam.create({
            shortCode: "CLO-FE-TEST",
            program: prog._id,
            CLOs: [clo1._id]
        });


        // 4. Create Exam Types & Templates
        const examNames = ["Proposal Defense", "Mid-Year Evaluation", "Final Defense"];
        const exams = {};

        for (const name of examNames) {
            // Create ExamType (needed for filtering)
            let et = await ExamType.findOne({ shortCode: name.substring(0, 3).toUpperCase() });
            if (!et) {
                et = await ExamType.create({
                    examName: name,
                    shortCode: name.substring(0, 3).toUpperCase(),
                    examTypeFor: "Supervisor"
                });
            }

            // Create Template
            let tmpl = await CreateExamModel.findOne({ examName: name });
            if (!tmpl) {
                tmpl = await CreateExamModel.create({
                    examName: name,
                    Term: term._id, // LINK TO TERM
                    ExamType: et._id, // LINK TO EXAM TYPE
                    ExamWeightage: 100,
                    AnnouncedDate: new Date()
                });
            } else {
                // Update if exists to ensure links
                tmpl.Term = term._id;
                tmpl.ExamType = et._id;
                tmpl.ExamWeightage = 100;
                await tmpl.save();
            }
            exams[name] = tmpl;
        }

        // 5. Create Approved FYP Group
        // Clean existing
        await FypRegistration.deleteMany({ user: student._id });

        const groupMembersData = [{
            _id: student._id,
            name: student.name,
            email: student.email,
            registrationNumber: student.registrationNumber,
            program: student.program,
            department: student.department,
            term: student.term,
            role: student.role,
            phoneNumber: student.phoneNumber
        }];

        const fypReg = await FypRegistration.create({
            user: student._id,
            groupMembers: groupMembersData,
            selectedOption: supervisor._id,
            selectedTechnology: tech._id,
            selectedPlatform: plat._id,
            topicData: { topic: "Complete Lifecycle Project", description: "Seeded for full flow", category: "Dev" },
            reqStatus: "approved",
            partStatus: "part-I",
            term: term._id
        });
        console.log("FYP Group Created:", fypReg._id);

        // 6. Create Panel
        await PanelDetails.deleteMany({ panelCode: "PNL-FULL" });
        const panel = await PanelDetails.create({
            department: dept._id,
            term: term._id,
            panelCode: "PNL-FULL",
            panelName: "Full Lifecycle Panel",
            PanelMembers: [
                { member: supervisor._id, role: "Examiner", evaluationStatus: "pending" },
                { member: member1 ? member1._id : supervisor._id, role: "Examiner", evaluationStatus: "pending" }
            ]
        });

        // Link Panel to Group
        fypReg.assignedPanel = panel._id;
        await fypReg.save();


        // 7. Loop to create Assignments and Evaluations
        // We need to ensure 'Evaluation' document exists for the Term
        let termEvaluation = await Evaluation.findOne({ termId: term._id });
        if (!termEvaluation) {
            termEvaluation = await Evaluation.create({ termId: term._id, exams: [] });
        }

        for (const name of examNames) {
            console.log(`Processing: ${name}`);

            // A. Create Assignment
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);

            const assign = await ExamAssignment.create({
                groupId: fypReg._id,
                termId: term._id,
                departmentId: dept._id,
                penal: panel._id,
                submitBy: coordinator._id,
                examTitle: name,
                partStatus: "part-I",
                points: 100,
                dueDate: dueDate.toISOString().split('T')[0],
                dueTime: "12:00 PM",
                reportStatus: "submitted", // Assume report submitted
                submitPdf: "dummy_report.pdf" // Added dummy key for frontend detection
            });


            // B. Construct Evaluation Tree
            // We need to push an 'ExamSchema' into 'termEvaluation.exams'

            // 1. Student Evaluation
            const studentEval = {
                studentId: student._id,
                marks: 85,
                obtainedAverage: 85,
                evaluationsByExaminers: []
            };

            // 2. Examiner Evaluations (for each panel member)
            for (const pm of panel.PanelMembers) {
                const examinerEval = {
                    examinerId: pm.member,
                    marks: 85,
                    totalWeightage: 100,
                    feedback: "Good progress.",
                    evaluations: [{
                        cloForExamId: cloForExam._id,
                        totalCLOPercentage: 100,
                        obtainedCLOPercentage: 85,
                        cloEvaluations: [{
                            cloId: clo1._id,
                            totalPercentage: 100,
                            obtainedPercentage: 85,
                            questions: [
                                { questionId: q1._id, marks: 4 },
                                { questionId: q2._id, marks: 4.5 }
                            ]
                        }]
                    }]
                };
                studentEval.evaluationsByExaminers.push(examinerEval);
            }

            // 3. FYP Group Evaluation
            const groupEval = {
                groupId: fypReg._id,
                panelId: panel._id,
                students: [studentEval],
                approvedStatus: "approved"
            };

            // 4. Exam Schema (to push into Evaluation.exams)
            // Check if this exam type already exists in the term evaluation
            // logic: we ideally want to update if exists, or push if new. For seeding, we push.

            // NOTE: The Schema structure in EvaluateExamModel.js shows 'exams' is an array of objects.
            // We'll push a new exam object.

            termEvaluation.exams.push({
                examId: exams[name]._id, // The CreateExamModel ID
                examTypeFor: "Supervisor",
                examName: name,
                fypGroups: [groupEval]
            });
        }

        await termEvaluation.save();
        console.log("Evaluations saved successfully.");

        console.log("\n--- SEEDING COMPLETE ---");
        console.log(`User: student@test.com (Pass: password123)`);
        console.log(`User: faculty@test.com (Pass: password123)`);
        await mongoose.disconnect();

    } catch (error) {
        console.error("Seeding Error:", error);
    }
};

seedLifecycle();
