const axios = require('axios');
const mongoose = require('mongoose');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const USER_EMAIL = 'coordinator@test.com';
const USER_PASS = 'password123';
const TERM_NAME = 'Fall-2025';

// Models
const GenUser = require("./server/models/AdminModels/GenUserModel");
const FYPTerm = require("./server/models/AdminModels/fypTerm");
const ExamCreation = require("./server/models/CoordinatorModels/ExamCreationModel");
const FYPRegistration = require("./server/models/StudentModels/fypRegModel");

const MARKS = {
    "Proposal": 80,
    "Attendance-I": 90,
    "Mid-I": 85,
    "Final-I": 88
};

async function runTest() {
    try {
        console.log("🚀 Starting Whitebox System Verification...");

        // 0. CONNECT DB
        await mongoose.connect("mongodb://localhost:27017/MIS");
        console.log("✅ Connected to DB");

        // 1. GET IDs
        const coordinator = await GenUser.findOne({ email: USER_EMAIL });
        if (!coordinator) throw new Error("Coordinator not found");
        console.log(`✅ Coordinator from DB: ${coordinator._id}`);

        const term = await FYPTerm.findOne({ sessionTerm: TERM_NAME });
        if (!term) throw new Error("Term not found");
        console.log(`✅ Term from DB: ${term.sessionTerm} (${term._id})`);

        const student = await GenUser.findOne({ role: "Student", term: term._id });
        if (!student) throw new Error("Student not found");
        console.log(`✅ Student from DB: ${student.name} (${student._id})`);

        // 2. ENSURE FYP GROUP (Required for evaluation)
        // We need a group containing this student
        let group = await FYPRegistration.findOne({ groupMembers: student._id });
        if (!group) {
            console.log("⚠️ No group found for student, creating mock group...");
            group = await FYPRegistration.create({
                groupName: "Test Group",
                groupMembers: [student._id],
                department: student.department,
                program: student.program,
                term: term._id,
                supervisor: coordinator._id, // Assign coordinator as mock supervisor
                status: "Approved"
            });
            console.log("✅ Group Created:", group._id);
        } else {
            console.log("✅ Group Found:", group._id);
        }

        // 3. ENSURE EXAMS EXIST
        // We need IDs for Proposal, Attendance-I, etc.
        const examIds = {};
        for (const examName of Object.keys(MARKS)) {
            let exam = await ExamCreation.findOne({
                termId: term._id,
                "ExamType.examName": examName // Assuming structure or we query properly
            });

            // Wait, ExamCreation structure is complex. 
            // It has `ExamType` field which is ObjectId ref to `ExamTypeModel`.
            // OR it stores the name directly?
            // "ExamType" in ExamCreationModel is a ref.
            // 3. ENSURE EXAMS EXIST (Assuming debug_exam.js seeded them)
            const ExamTypeModel = require("./server/models/CoordinatorModels/ExamTypeModel");
            let type = await ExamTypeModel.findOne({ examName: examName });
            if (!type) throw new Error(`ExamType ${examName} NOT FOUND. Run debug_exam.js first.`);

            let exam = await ExamCreation.findOne({ Term: term._id, ExamType: type._id });
            if (!exam) throw new Error(`Exam ${examName} NOT FOUND for Term Fall-2025. Run debug_exam.js first.`);

            examIds[examName] = exam._id;
        }
        console.log("✅ Exam IDs:", examIds);


        // 4. LOGIN (API)
        console.log("\n🔐 API Login...");
        const loginRes = await axios.post(`${BASE_URL}/auth/Genlogin`, {
            email: USER_EMAIL,
            password: USER_PASS,
            role: "Coordinator"
        });
        const token = loginRes.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log("✅ Login Successful");


        // 5. SUBMIT MARKS (API)
        console.log("\n📝 Submitting Marks...");
        for (const examName of Object.keys(MARKS)) {
            const payload = {
                groupId: group._id.toString(),
                termId: term._id.toString(),
                examId: examIds[examName].toString(),
                examinerId: coordinator._id.toString(),
                evaluations: [{
                    studentId: student._id.toString(),
                    marks: MARKS[examName], // Simple mark? 
                    // Controller logic: 
                    // student.evaluations -> map -> evaluationsByExaminers
                    // Wait, logic is complex. 
                    // If 'containsCLO' is false (default), it calls handleEvaluationWithoutCLOs
                    // which calls storeMarksForAttendance? 
                    // Wait, checks exam type.

                    // IF exam is generic, we might need simple structure.
                    // Let's assume simplest:
                    marks: MARKS[examName]
                }]
            };

            // NOTE: The controller logic (Lines ~1295) for 'handleEvaluationWithoutCLOs' 
            // checks examType === "Attendance" or "Orientation" or throws "Invalid exam type".
            // THIS IS A PROBLEM.
            // If "Proposal" is not handled, it might fail.
            // But we saw `addEvaluationMarks` calls `handleEvaluationWithoutCLOs`.
            // Let's hope it handles default or we need to trick it.
            // Actually, `handleEvaluationWithoutCLOs` at 590 (commented) showed type check.
            // The active one might be different.

            try {
                await axios.post(`${BASE_URL}/EvaluateExamRoutes/evaluations/${group._id}`, payload, config);
                // Wait, route is `router.post("/evaluations/:groupId", ...)`
                // which calls `addEvaluationMarks`.
                console.log(`   ✅ Marked ${examName}`);
            } catch (e) {
                console.error(`   ❌ Failed to mark ${examName}:`, e.response?.data || e.message);
            }
        }

        // 6. VERIFY REPORTS
        console.log("\n📊 Verifying Reports...");
        const portalRes = await axios.get(`${BASE_URL}/EvaluateExamRoutes/portal-report/${term._id}`, config);
        const studentPortal = portalRes.data.data?.find(s => s.registrationNumber === student.registrationNumber);

        if (studentPortal) {
            console.log("   ✅ Portal Report Data Found");
            console.log(`      Total: ${studentPortal.Total} (Exp: ~86.2)`);
        } else {
            console.error("   ❌ Student not found in Portal Report");
        }

        const overallRes = await axios.get(`${BASE_URL}/EvaluateExamRoutes/overall-fyp-result/${term._id}`, config);
        const studentOverall = overallRes.data.data?.find(s => s.registrationNumber === student.registrationNumber);

        if (studentOverall) {
            console.log("   ✅ Overall Result Data Found");
            console.log(`      TotalPartI: ${studentOverall.TotalPartI} (Exp: 343)`);
        } else {
            console.error("   ❌ Student not found in Overall Result");
        }

        await mongoose.disconnect();

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error);
        await mongoose.disconnect();
    }
}

runTest();
