const mongoose = require("mongoose");
require("dotenv").config();

// --- Models ---
const GenUser = require("./server/models/AdminModels/GenUserModel");
const FypRegistration = require("./server/models/StudentModels/fypRegModel");
const PanelDetails = require("./server/models/CoordinatorModels/PenalModel");
const ExamAssignment = require("./server/models/CoordinatorModels/ExamAssignment");
const FYPTerm = require("./server/models/AdminModels/fypTerm");
const Department = require("./server/models/AdminModels/department");
const Program = require("./server/models/AdminModels/program");
const Technology = require("./server/models/CoordinatorModels/Technology");
const Platform = require("./server/models/CoordinatorModels/PlatformModel");

// Assessment Models
const ManageCLO = require("./server/models/CoordinatorModels/CLOsModel");
const QuestionsForCLO = require("./server/models/CoordinatorModels/QuesForCLOModel");
const CLOForExam = require("./server/models/CoordinatorModels/CLOForExamModel");
const CreateExamModel = require("./server/models/CoordinatorModels/CreateExamModel");
const ExamType = require("./server/models/CoordinatorModels/ExamTypeModel");
const Evaluation = require("./server/models/CoordinatorModels/EvaluateExamModel");

const seedResults = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB for Result Seeding");

        // 1. Fetch Key Entities
        const student = await GenUser.findOne({ email: "student@test.com" });
        const supervisor = await GenUser.findOne({ email: "faculty@test.com" });
        const coordinator = await GenUser.findOne({ email: "coordinator@test.com" });
        const term = await FYPTerm.findOne({ sessionTerm: "Fall-2025" });
        const dept = await Department.findOne({ departmentName: "Computer Science" });
        const prog = await Program.findOne({ programTitle: "BSCS" });

        if (!student || !term || !dept) {
            console.error("Required entities (Student, Term, Dept) not found. Run base seed first.");
            process.exit(1);
        }

        // Fetch/Create Tech & Platform (Required for FypRegistration)
        let tech = await Technology.findOne({ techName: "Test Tech" });
        if (!tech) tech = await Technology.create({ techName: "Test Tech", user: coordinator._id });

        let plat = await Platform.findOne({ platformName: "Test Platform" });
        if (!plat) plat = await Platform.create({ platformName: "Test Platform", user: coordinator._id });

        // 2. Fetch or Create FYP Group
        let fypReg = await FypRegistration.findOne({ user: student._id });
        if (!fypReg) {
            console.log("Creating FYP Group...");
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
            fypReg = await FypRegistration.create({
                user: student._id,
                groupMembers: groupMembersData,
                selectedOption: supervisor._id,
                selectedTechnology: tech._id,
                selectedPlatform: plat._id,
                topicData: { topic: "Result Mapping Test Project", description: "Testing Portal Report", category: "Dev" },
                reqStatus: "approved",
                partStatus: "part-I",
                term: term._id
            });
        }

        console.log(`Target Group ID: ${fypReg._id}`);

        // 3. Define the 8 Official Exams
        const examsToSeed = [
            // Part I
            { name: "Orientation", part: "part-I", marks: 80 },   // Maps to Q1, Q2
            { name: "Proposal", part: "part-I", marks: 75 },      // Maps to Q3, Q4
            { name: "Mid-I", part: "part-I", marks: 85 },         // Maps to M1, M2
            { name: "Attendance-I", part: "part-I", marks: 90 },  // Maps to A1-A4
            { name: "Final-I", part: "part-I", marks: 88 },       // Maps to F1-F4

            // Part II
            { name: "Attendance-II", part: "part-II", marks: 95 }, // Maps to Q1-Q4 (Part II)
            { name: "Mid-II", part: "part-II", marks: 82 },        // Maps to M1, M2 (Part II)
            { name: "Final-II", part: "part-II", marks: 91 }       // Maps to F1-F4 (Part II)
        ];

        // 4. Ensure Term Evaluation Container Exists
        let termEvaluation = await Evaluation.findOne({ termId: term._id });
        if (!termEvaluation) {
            termEvaluation = await Evaluation.create({ termId: term._id, exams: [] });
        }

        // Clean existing exams from termEvaluation to avoid duplicates for this test
        termEvaluation.exams = [];

        // 5. Create Assessment Data (CLOs, Questions) - Simplified
        // We'll reuse one CLO structure for strictly generating the 'marks' needed for the report
        let q1 = await QuestionsForCLO.findOne({ shortCode: "Q-SEED" });
        if (!q1) q1 = await QuestionsForCLO.create({ shortCode: "Q-SEED", question: "Generic seed question", marks: 100 });

        let clo1 = await ManageCLO.findOne({ CLOCode: "CLO-SEED" });
        if (!clo1) clo1 = await ManageCLO.create({ CLOCode: "CLO-SEED", Title: "Seeding CLO", Program: prog._id, Questions: [q1._id] });

        let cloForExam = await CLOForExam.create({ shortCode: "CLO-FE-SEED", program: prog._id, CLOs: [clo1._id] });


        // 6. Loop and Seed Exams
        for (const examData of examsToSeed) {
            console.log(`Seeding Exam: ${examData.name}`);

            // A. Create/Find Exam Type
            let et = await ExamType.findOne({ examName: examData.name });
            if (!et) {
                et = await ExamType.create({
                    examName: examData.name,
                    shortCode: examData.name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 100),
                    examTypeFor: "Supervisor"
                });
            }

            // B. Create Exam Template
            let createExam = await CreateExamModel.findOne({ examName: examData.name });
            if (!createExam) {
                createExam = await CreateExamModel.create({
                    examName: examData.name
                });
            }

            // C. Create Evaluation Entry (The core data source for the report)
            const obtainedMarks = examData.marks; // e.g., 85/100

            const examinerEval = {
                examinerId: supervisor._id,
                marks: obtainedMarks,
                totalWeightage: 100,
                feedback: "Auto-seeded result",
                evaluations: [{
                    cloForExamId: cloForExam._id,
                    totalCLOPercentage: 100,
                    obtainedCLOPercentage: obtainedMarks,
                    cloEvaluations: [{
                        cloId: clo1._id,
                        totalPercentage: 100,
                        obtainedPercentage: obtainedMarks,
                        questions: [{ questionId: q1._id, marks: obtainedMarks }]
                    }]
                }]
            };

            const studentEval = {
                studentId: student._id,
                marks: obtainedMarks,
                obtainedAverage: obtainedMarks, // Ideally average of examiners, here just 1
                obtainedAverageofCLO: [{ // Crucial for the CLO columns in standard report
                    cloId: clo1._id,
                    averageCLOPercentage: obtainedMarks,
                    totalCLOPercentage: 100
                }],
                evaluationsByExaminers: [examinerEval]
            };

            const groupEval = {
                groupId: fypReg._id,
                panelId: new mongoose.Types.ObjectId(), // Placeholder
                students: [studentEval],
                approvedStatus: "approved"
            };

            // Push to Term Evaluation
            termEvaluation.exams.push({
                examId: createExam._id,
                examTypeFor: "Supervisor",
                examName: examData.name,
                fypGroups: [groupEval]
            });
        }

        await termEvaluation.save();
        console.log("All 8 exams seeded successfully!");

        await mongoose.disconnect();

    } catch (error) {
        console.error("Seeding Failed - Full Error:");
        console.log(error); // Log the full error object directly
    }
};

seedResults();
