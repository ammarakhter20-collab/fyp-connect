const mongoose = require("mongoose");
require("dotenv").config();

// Models
const GenUser = require("./server/models/AdminModels/GenUserModel");
const FypRegistration = require("./server/models/StudentModels/fypRegModel");
const PanelDetails = require("./server/models/CoordinatorModels/PenalModel");
const ExamAssignment = require("./server/models/CoordinatorModels/ExamAssignment");
const Technology = require("./server/models/CoordinatorModels/Technology");
const Platform = require("./server/models/CoordinatorModels/PlatformModel");
const Department = require("./server/models/AdminModels/department");
const Program = require("./server/models/AdminModels/program");
const FYPTerm = require("./server/models/AdminModels/fypTerm");
const bcrypt = require("bcrypt");

// Constants
const FIRST_NAMES = ["Ali", "Ahmed", "Bilal", "Hamza", "Usman", "Ayesha", "Fatima", "Zainab", "Sana", "Mariam", "Omar", "Hassan", "Saad", "Abdullah", "Yusuf"];
const LAST_NAMES = ["Khan", "Malik", "Ahmed", "Raja", "Shah", "Bhatti", "Chaudhry", "Sheikh", "Ansari", "Iqbal"];
const DEPT_NAME = "Computer Science";
const PROG_NAME = "BSCS";
const TERMS = ["Fall 2024", "Spring 2025"];

// Helpers
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const generateName = () => `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`;

const logError = (step, error) => {
    console.error(`\n[ERROR] Step: ${step} failed`);
    console.error(`Message: ${error.message}`);
    if (error.errors) {
        Object.keys(error.errors).forEach(field => {
            console.error(`  - Field: ${field}, Error: ${error.errors[field].message}`);
        });
    }
};

const seedComprehensiveBatch = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        const hashedPassword = await bcrypt.hash("password123", 10);

        // 1. Ensure Department & Program
        let dept, prog;
        try {
            console.log("1. Setting up Dept/Prog...");
            dept = await Department.findOne({ departmentName: DEPT_NAME }); // Fixed
            if (!dept) dept = await Department.create({ departmentName: DEPT_NAME });

            prog = await Program.findOne({ programTitle: PROG_NAME }); // Fixed
            if (!prog) prog = await Program.create({
                programTitle: PROG_NAME,
                department: dept._id,
                shortCode: "BSCS"
            });
        } catch (e) { return logError("Dept/Prog", e); }

        // 2. Ensure Terms
        let currentTerm;
        try {
            console.log("2. Setting up Terms...");
            const termDocs = [];
            for (const tName of TERMS) {
                let term = await FYPTerm.findOne({ sessionTerm: tName });
                if (!term) term = await FYPTerm.create({
                    sessionTerm: tName,
                    description: "Auto-generated term",
                    startDate: new Date(),  // Fixed: Required
                    endDate: new Date(Date.now() + 86400000 * 180) // Fixed: Required (+6 months)
                });
                termDocs.push(term);
            }
            currentTerm = termDocs[0];
        } catch (e) { return logError("Terms", e); }

        // 3. Create Key Roles (Coordinator)
        let coordinator;
        try {
            console.log("3. Creating Coordinator...");
            coordinator = await GenUser.findOneAndUpdate(
                { email: "coordinator@test.com" },
                {
                    name: "Dr. Coordinator", role: "Coordinator", department: dept._id,
                    password: hashedPassword
                },
                { upsert: true, new: true, runValidators: false }
            );
        } catch (e) { return logError("Coordinator", e); }

        // 4. Create Supervisors
        const supervisors = [];
        try {
            console.log("4. Creating Supervisors...");
            for (let i = 1; i <= 5; i++) {
                const email = `sup${i}@test.com`;
                const sup = await GenUser.findOneAndUpdate(
                    { email },
                    {
                        name: `Dr. ${generateName()}`,
                        role: "faculty",
                        department: dept._id,
                        password: hashedPassword,
                        program: prog._id,
                        phoneNumber: "1234567890",
                        term: currentTerm._id,
                        designation: "Lecturer",
                        extension: "000",
                        facultyId: `FAC-${1000 + i}`
                    },
                    { upsert: true, new: true, runValidators: false }
                );
                supervisors.push(sup);
            }
        } catch (e) { return logError("Supervisors", e); }

        // 5. Create Students
        const students = [];
        try {
            console.log("5. Creating Students...");
            for (let i = 1; i <= 30; i++) {
                const email = `std${i}@test.com`;
                const name = generateName();
                const std = await GenUser.findOneAndUpdate(
                    { email },
                    {
                        name,
                        role: "Student",
                        department: dept._id,
                        password: hashedPassword,
                        registrationNumber: `STD-${2000 + i}`,
                        program: prog._id,
                        phoneNumber: "1234567890",
                        term: currentTerm._id,
                        partStatus: "part-I"
                    },
                    { upsert: true, new: true, runValidators: false }
                );
                students.push(std);
            }
        } catch (e) { return logError("Students", e); }

        // 6. Utilities
        let tech, plat;
        try {
            console.log("6. Creating Utilities...");
            tech = await Technology.findOne({ techName: "MERN Stack" });
            if (!tech) tech = await Technology.create({ techName: "MERN Stack", user: coordinator?._id });

            plat = await Platform.findOne({ platformName: "Web" });
            if (!plat) plat = await Platform.create({ platformName: "Web", user: coordinator?._id });
        } catch (e) { return logError("Utilities", e); }

        // 7. Panels
        const panels = [];
        try {
            console.log("7. Creating Panels...");
            for (let i = 1; i <= 3; i++) {
                const panelCode = `PNL-24-${i}`;
                const member1 = supervisors[i % supervisors.length];
                const member2 = supervisors[(i + 1) % supervisors.length];

                const panel = await PanelDetails.findOneAndUpdate(
                    { panelCode },
                    {
                        panelName: `Panel ${String.fromCharCode(64 + i)}`,
                        department: dept._id,
                        term: currentTerm._id,
                        PanelMembers: [
                            { member: member1._id, role: "Examiner", evaluationStatus: "pending" },
                            { member: member2._id, role: "Examiner", evaluationStatus: "pending" }
                        ]
                    },
                    { upsert: true, new: true, runValidators: false }
                );
                panels.push(panel);
            }
        } catch (e) { return logError("Panels", e); }

        // 8. Groups & Exams
        try {
            console.log("8. Creating Groups & Assignments...");
            await FypRegistration.deleteMany({ term: currentTerm._id });

            let studentIdx = 0;
            let groupCount = 0;

            while (studentIdx < students.length) {
                const groupSize = getRandomInt(2, 3);
                const groupMembers = students.slice(studentIdx, studentIdx + groupSize);
                if (groupMembers.length === 0) break;

                const selectedSup = supervisors[groupCount % supervisors.length];

                const groupMembersData = groupMembers.map(m => ({
                    _id: m._id, name: m.name, email: m.email,
                    registrationNumber: m.registrationNumber, program: m.program,
                    department: m.department, term: m.term, role: m.role, phoneNumber: m.phoneNumber
                }));

                const fypReg = await FypRegistration.create({
                    user: groupMembers[0]._id, // Leader
                    groupMembers: groupMembersData,
                    selectedOption: selectedSup._id,
                    selectedTechnology: tech._id,
                    selectedPlatform: plat._id,
                    topicData: {
                        topic: `Project ${generateName()}`,
                        description: "Seed Project",
                        category: "Development"
                    },
                    reqStatus: "approved",
                    partStatus: "part-I",
                    term: currentTerm._id,
                    assignedPanel: panels[groupCount % panels.length]._id
                });

                // Create Exams
                const todayStr = new Date().toISOString().split('T')[0];

                await ExamAssignment.create({
                    groupId: fypReg._id,
                    termId: currentTerm._id,
                    departmentId: dept._id,
                    penal: fypReg.assignedPanel,
                    submitBy: coordinator?._id,
                    examTitle: "Mid-I",
                    partStatus: "part-I",
                    points: 50,
                    dueDate: todayStr,
                    dueTime: "09:00 AM",
                    reportStatus: "pending"
                });

                await ExamAssignment.create({
                    groupId: fypReg._id,
                    termId: currentTerm._id,
                    departmentId: dept._id,
                    penal: fypReg.assignedPanel,
                    submitBy: coordinator?._id,
                    examTitle: "Final-I",
                    partStatus: "part-I",
                    points: 100,
                    dueDate: todayStr, // Active
                    dueTime: "12:00 PM",
                    reportStatus: "pending"
                });

                groupCount++;
                studentIdx += groupSize;
            }
            console.log(`\nSUCCESS: Created ${groupCount} groups.`);
        } catch (e) { return logError("Groups/Exams", e); }

        console.log("\n--- SEEDING COMPLETE ---");
        await mongoose.disconnect();
    } catch (error) {
        logError("Top Level", error);
    }
};

seedComprehensiveBatch();
