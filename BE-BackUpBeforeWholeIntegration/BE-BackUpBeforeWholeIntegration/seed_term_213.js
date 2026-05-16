const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Models
const FYPTerm = require("./server/models/AdminModels/fypTerm");
const GenUser = require("./server/models/AdminModels/GenUserModel");
const Department = require("./server/models/AdminModels/department");
const Program = require("./server/models/AdminModels/program");
const Technology = require("./server/models/CoordinatorModels/Technology");
const Platform = require("./server/models/CoordinatorModels/PlatformModel");
const FypRegistration = require("./server/models/StudentModels/fypRegModel");
const ExamType = require("./server/models/CoordinatorModels/ExamTypeModel");
const CreateExam = require("./server/models/CoordinatorModels/ExamCreationModel");
const Evaluation = require("./server/models/CoordinatorModels/EvaluateExamModel");
const Result = require("./server/models/CoordinatorModels/ResultsModel");

const seedData = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/MIS";
        await mongoose.connect(mongoUrl);
        console.log("Connected to MongoDB at " + mongoUrl);

        // 1. Term 213
        let term = await FYPTerm.findOne({ sessionTerm: "213" });
        if (!term) {
            term = await FYPTerm.create({
                sessionTerm: "213",
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
                status: "activated",
            });
        } else {
            term.status = "activated";
            await term.save();
        }

        // 2. Department & Program
        let dept = await Department.findOne({ departmentName: "Computer Science" });
        if (!dept) dept = await Department.create({ departmentName: "Computer Science", description: "CS Dept" });

        let program = await Program.findOne({ programTitle: "BSCS" });
        if (!program) {
            program = await Program.create({
                programTitle: "BSCS",
                shortCode: "BSCS",
                department: dept._id
            });
        }

        // 3. Supervisor
        let supervisor = await GenUser.findOne({ email: "supervisor_213@test.com" });
        if (!supervisor) {
            supervisor = await GenUser.create({
                name: "Dr. Supervisor 213",
                email: "supervisor_213@test.com",
                password: "password123",
                role: "faculty",
                department: dept._id,
            });
        }

        // 4. Technology & Platform
        let tech = await Technology.findOne({ techName: "MERN Stack" });
        if (!tech) await Technology.create({ techName: "MERN Stack", user: supervisor._id });

        let plat = await Platform.findOne({ platformName: "Web" });
        if (!plat) await Platform.create({ platformName: "Web", user: supervisor._id });

        // 5. Students
        console.log("Checking Students...");
        const studentData = [
            { name: "Ali Khan", email: "ali.213@test.com", reg: "FA21-BCS-001" },
            { name: "Sara Ahmed", email: "sara.213@test.com", reg: "FA21-BCS-002" },
            { name: "Bilal H", email: "bilal.213@test.com", reg: "FA21-BCS-003" }
        ];

        const students = [];
        for (const s of studentData) {
            let stud = await GenUser.findOne({ email: s.email });
            if (!stud) {
                stud = await GenUser.create({
                    name: s.name,
                    email: s.email,
                    password: "password123",
                    role: "Student",
                    department: dept._id,
                    term: term._id,
                    program: program._id,
                    registrationNumber: s.reg,
                    partStatus: "part-I"
                });
            }
            students.push(stud);
        }

        // 6. FypRegistration
        console.log("Checking FypRegistration...");
        const groupMembers = students.map(s => ({
            _id: s._id,
            name: s.name,
            email: s.email,
            department: s.department,
            program: s.program,
            term: s.term,
            role: s.role,
            registrationNumber: s.registrationNumber
        }));

        let fypReg = await FypRegistration.findOne({ "groupMembers.email": students[0].email });
        if (!fypReg) {
            fypReg = await FypRegistration.create({
                groupMembers: groupMembers,
                selectedOption: supervisor._id,
                selectedTechnology: tech._id,
                selectedPlatform: plat._id,
                topicData: { title: "Smart Term Portal", description: "Managing terms efficiently." },
                reqStatus: "Accepted",
                user: students[0]._id,
                term: term._id
            });
        }

        // 7. Exam Types & Exams
        // Updated to include Attendance-I and Orientation for Assignments/Quizzes mapping
        const examTypesData = [
            { name: "Proposal", code: "PROP-213", for: "All" },
            { name: "Mid-I", code: "MID1-213", for: "All" },
            { name: "Final-I", code: "FIN1-213", for: "All" },
            { name: "Attendance-I", code: "ATT1-213", for: "All" }, // Maps to A1-A4
            { name: "Orientation", code: "ORI-213", for: "All" }    // Maps to Q1, Q2
        ];

        const createdExams = [];

        for (const et of examTypesData) {
            let type = await ExamType.findOne({ shortCode: et.code });
            if (!type) {
                type = await ExamType.create({
                    examName: et.name,
                    shortCode: et.code,
                    examTypeFor: et.for
                });
            }

            let exam = await CreateExam.findOne({ Term: term._id, ExamType: type._id });
            if (!exam) {
                exam = await CreateExam.create({
                    Term: term._id,
                    ExamType: type._id, // This links to ExamType which has the name
                    ExamWeightage: 30, // Simplified
                    AnnouncedDate: new Date()
                });
            }
            createdExams.push({ doc: exam, name: et.name });
        }

        // 8. Evaluation
        console.log("Adding Marks (Evaluation)......");
        let evaluation = await Evaluation.findOne({ termId: term._id });

        const examEvaluations = createdExams.map(item => {
            const exam = item.doc;
            const name = item.name;

            // Basic marks logic
            let baseMarks = 80;
            if (name === "Attendance-I") baseMarks = 90; // High attendance
            if (name === "Orientation") baseMarks = 85;

            return {
                examId: exam._id,
                examTypeFor: "All",
                examName: name,
                fypGroups: [
                    {
                        groupId: fypReg._id,
                        students: students.map(s => ({
                            studentId: s._id,
                            marks: Math.floor(Math.random() * 10) + baseMarks,
                            obtainedAverage: Math.floor(Math.random() * 10) + baseMarks,
                            evaluationsByExaminers: []
                        })),
                        approvedStatus: "approved"
                    }
                ]
            };
        });

        if (!evaluation) {
            evaluation = await Evaluation.create({
                termId: term._id,
                exams: examEvaluations
            });
        } else {
            evaluation.exams = examEvaluations;
            await evaluation.save();
        }

        console.log("Seeding Complete!");
        console.log("Evaluation updated with Attendance-I and Orientation to populate Portal Report Assignment/Quiz columns.");

        await mongoose.disconnect();
    } catch (err) {
        console.error("Seeding Error:", err);
        await mongoose.disconnect();
    }
};

seedData();
