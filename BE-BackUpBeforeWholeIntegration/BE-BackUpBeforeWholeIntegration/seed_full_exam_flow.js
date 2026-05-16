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

const seedExamFlow = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        // 1. Fetch Key Users
        const student = await GenUser.findOne({ email: "student@test.com" });
        const supervisor = await GenUser.findOne({ email: "faculty@test.com" });
        const coordinator = await GenUser.findOne({ email: "coordinator@test.com" });
        const member1 = await GenUser.findOne({ email: "member1@test.com" });
        const member2 = await GenUser.findOne({ email: "member2@test.com" });

        if (!student || !supervisor || !coordinator) {
            console.error("Missing required users (Student, Faculty, or Coordinator). Run create_test_data.js first.");
            process.exit(1);
        }

        // 2. Fetch/Create Utilities
        let tech = await Technology.findOne({ techName: "Test Tech" });
        if (!tech) tech = await Technology.create({ techName: "Test Tech", user: coordinator._id });

        let plat = await Platform.findOne({ platformName: "Test Platform" });
        if (!plat) plat = await Platform.create({ platformName: "Test Platform", user: coordinator._id });

        // 3. Create/Update FYP Registration (Approved)
        // Construct groupMembers array based on GenUser schema subset required by GroupMemberSchema
        const groupMembersData = [];
        [student, member1, member2].forEach(m => {
            if (m) {
                groupMembersData.push({
                    _id: m._id, // Ensure ID is preserved
                    name: m.name,
                    email: m.email,
                    registrationNumber: m.registrationNumber,
                    program: m.program,
                    department: m.department,
                    term: m.term,
                    role: m.role,
                    phoneNumber: m.phoneNumber
                });
            }
        });

        // Clean up existing registrations for this student
        await FypRegistration.deleteMany({ user: student._id });

        const fypReg = await FypRegistration.create({
            user: student._id,
            groupMembers: groupMembersData,
            selectedOption: supervisor._id,
            selectedTechnology: tech._id,
            selectedPlatform: plat._id,
            topicData: {
                topic: "Automated Test Project",
                description: "This project was auto-generated for testing exam flow.",
                category: "Research"
            },
            reqStatus: "approved",
            partStatus: "part-I",
            term: student.term
        });
        console.log("Created Approved FYP Registration:", fypReg._id);

        // 4. Create Panel
        await PanelDetails.deleteMany({ panelCode: "PNL-TEST" });
        const panel = await PanelDetails.create({
            department: student.department,
            term: student.term,
            panelCode: "PNL-TEST",
            panelName: "Test Panel Alpha",
            PanelMembers: [
                {
                    member: supervisor._id,
                    role: "Examiner",
                    evaluationStatus: "pending"
                }
            ]
        });
        console.log("Created Panel:", panel._id);

        // 5. Update FYP Reg with Panel
        // Note: Schema says 'assignedPanel' has 'ref: PanelDetails', so we store the ID.
        fypReg.assignedPanel = panel._id; // Mongoose handle casting if typ is Object but valid ID
        await fypReg.save();
        console.log("Assigned Panel to FYP Group");

        // 6. Create Exam Assignment
        await ExamAssignment.deleteMany({ groupId: fypReg._id });

        // Date formatting
        const due = new Date();
        due.setDate(due.getDate() + 7);
        const dateString = due.toISOString().split('T')[0]; // YYYY-MM-DD roughly

        const exam = await ExamAssignment.create({
            groupId: fypReg._id,
            termId: student.term,
            departmentId: student.department,
            penal: panel._id,
            submitBy: coordinator._id,
            examTitle: "Final Defense",
            partStatus: "part-I",
            points: 100,
            dueDate: dateString,
            dueTime: "12:00 PM",
            reportStatus: "pending"
        });
        console.log("Created Exam Assignment:", exam._id);

        console.log("\n--- SUCCESS ---");
        console.log("1. 'student@test.com' group is APPROVED.");
        console.log("2. Panel 'Test Panel Alpha' assigned.");
        console.log("3. 'Final Defense' exam assigned.");
        console.log("You can now login as Supervisor (faculty@test.com) to view 'Assigned Exams'.");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error seeding exam flow:", error);
    }
};

seedExamFlow();
