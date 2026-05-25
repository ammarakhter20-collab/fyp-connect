const mongoose = require("mongoose");
process.env.TOKEN_KEY = "testsecretkey";

const GenUser = require("../server/models/AdminModels/GenUserModel");
const Department = require("../server/models/AdminModels/department");
const Program = require("../server/models/AdminModels/program");
const FYPTerm = require("../server/models/AdminModels/fypTerm");
const FypRegistration = require("../server/models/StudentModels/fypRegModel");
const Technology = require("../server/models/CoordinatorModels/Technology");
const Platform = require("../server/models/CoordinatorModels/PlatformModel");
const ExamType = require("../server/models/CoordinatorModels/ExamTypeModel");
const CreateExam = require("../server/models/CoordinatorModels/ExamCreationModel");
const PanelDetails = require("../server/models/CoordinatorModels/PenalModel");
const PassFailCriteria = require("../server/models/CoordinatorModels/PassFailCriteriaModel");
const StudentReport = require("../server/models/CoordinatorModels/StudentReportsModel");
const Evaluation = require("../server/models/CoordinatorModels/EvaluateExamModel");

const { promoteGroupsToPartII } = require("../server/controllers/CoordinatorController/TermContinuationController");
const { getFypRegistrationsByPanelMember } = require("../server/controllers/SupervisorController.js/FetchAssignedExams");
const { addEvaluationMarks } = require("../server/controllers/CoordinatorController/EvaluateExamCont");
const { getFypData } = require("../server/controllers/StudentCont/fypRegController");

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("=============================================================");
    console.log("CONNECTED TO DATABASE. Starting Strategy 1 Verification Test...");
    console.log("=============================================================\n");

    // Cleanup first
    const testEmails = [
      "sup_s1@example.com",
      "p1_s1@example.com",
      "p2_s1@example.com",
      "p3_s1@example.com",
      "s_fail_1@example.com",
      "s_pass_2@example.com",
      "s_pass_3@example.com"
    ];
    await GenUser.deleteMany({ email: { $in: testEmails } });
    await FYPTerm.deleteMany({ sessionTerm: { $in: ["TERM-V1", "TERM-V2"] } });

    // Seed Dept & Prog
    let dept = await Department.findOne({ departmentName: "Computer Science" });
    if (!dept) {
      dept = new Department({ departmentName: "Computer Science" });
      await dept.save();
    }
    let prog = await Program.findOne({ shortCode: "SE" });
    if (!prog) {
      prog = new Program({ programTitle: "Software Engineering", shortCode: "SE", department: dept._id });
      await prog.save();
    }

    // Seed Terms
    const termA = new FYPTerm({ sessionTerm: "TERM-V1", startDate: new Date("2025-09-01"), endDate: new Date("2026-01-31"), status: "deactivated" });
    await termA.save();
    const termB = new FYPTerm({ sessionTerm: "TERM-V2", startDate: new Date("2026-02-01"), endDate: new Date("2026-06-30"), status: "activated" });
    await termB.save();

    // Pass Criteria
    const criteria = new PassFailCriteria({ term: termA._id, passingCriteria: 50 });
    await criteria.save();

    // Supervisor & Panels
    const supervisor = new GenUser({ name: "Sup V1", email: "sup_s1@example.com", password: "password123", role: "faculty", department: dept._id });
    await supervisor.save();

    const panelFaculty = [];
    for (let i = 1; i <= 3; i++) {
      const fac = new GenUser({ name: `Fac V1-${i}`, email: `p${i}_s1@example.com`, password: "password123", role: "faculty", department: dept._id });
      await fac.save();
      panelFaculty.push(fac);
    }

    const panel = new PanelDetails({
      department: dept._id,
      term: termA._id,
      panelCode: "P-V1",
      panelName: "Panel V1",
      PanelMembers: [
        { member: panelFaculty[0]._id, role: "Panel Head" },
        { member: panelFaculty[1]._id, role: "Examiner" },
        { member: panelFaculty[2]._id, role: "Examiner" }
      ]
    });
    await panel.save();

    // Students in Term A
    const student1 = new GenUser({ name: "Fail Student 1", email: "s_fail_1@example.com", password: "password123", role: "Student", department: dept._id, program: prog._id, term: termA._id, registrationNumber: "V1-REG-01", partStatus: "part-I" });
    await student1.save();
    const student2 = new GenUser({ name: "Pass Student 2", email: "s_pass_2@example.com", password: "password123", role: "Student", department: dept._id, program: prog._id, term: termA._id, registrationNumber: "V1-REG-02", partStatus: "part-I" });
    await student2.save();
    const student3 = new GenUser({ name: "Pass Student 3", email: "s_pass_3@example.com", password: "password123", role: "Student", department: dept._id, program: prog._id, term: termA._id, registrationNumber: "V1-REG-03", partStatus: "part-I" });
    await student3.save();

    // Group
    let tech = await Technology.findOne({ techName: "Test Node.js" }) || new Technology({ techName: "Test Node.js", description: "Node" });
    await tech.save();
    let plat = await Platform.findOne({ platformName: "Test Web Platform" }) || new Platform({ platformName: "Test Web Platform" });
    await plat.save();

    const group = new FypRegistration({
      groupMembers: [student1, student2, student3],
      selectedOption: supervisor._id,
      selectedTechnology: tech._id,
      topicData: { topic: "Verification Project", description: "Desc", category: "Web" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: student1._id,
      term: termA._id.toString(),
      assignedPanel: panel
    });
    await group.save();

    // Exams
    const proposalExamType = new ExamType({ examName: "Proposal", shortCode: "V1-Proposal", examTypeFor: "All", portalCategory: "Midterm", defaultPart: "Part-I" });
    await proposalExamType.save();
    const proposalExam = new CreateExam({ Term: termA._id, ExamType: proposalExamType._id, ExamWeightage: 100, AnnouncedDate: new Date(), partStatus: "Part-I", portalCategory: "Midterm", department: dept._id, program: prog._id });
    await proposalExam.save();

    // Evaluations
    const buildStudentEval = (studentId, obtainedAverage) => ({
      studentId,
      obtainedAverage,
      evaluationsByExaminers: [{ examinerId: panelFaculty[0]._id, marks: obtainedAverage }],
      marks: obtainedAverage
    });
    const evaluationDoc = new Evaluation({
      supervisorId: supervisor._id,
      terms: [{
        termId: termA._id,
        exams: [{
          examId: proposalExam._id,
          examTypeFor: "All",
          examName: "Proposal",
          fypGroups: [{
            groupId: group._id,
            panelId: panel._id,
            students: [
              buildStudentEval(student1._id, 10), // Fails
              buildStudentEval(student2._id, 80), // Passes
              buildStudentEval(student3._id, 80)  // Passes
            ],
            approvedStatus: "approved"
          }]
        }]
      }],
      uploadedBy: supervisor._id
    });
    await evaluationDoc.save();

    console.log("--- STEP 1: Running Term Continuation Promotion ---");
    let promoResStatus = null;
    let promoResData = null;
    const mockPromoRes = {
      status(code) { promoResStatus = code; return this; },
      json(data) { promoResData = data; return this; }
    };
    await promoteGroupsToPartII({ body: { termId: termA._id.toString() } }, mockPromoRes);
    console.log(`Continuation promotion complete. Status: ${promoResStatus}`);

    console.log("\n--- STEP 2: Verifying database retention ---");
    const updatedGroup = await FypRegistration.findById(group._id);
    console.log(`Group Status in DB: "${updatedGroup.partStatus}" (Expected: "part-II")`);
    console.log(`Group members count in DB: ${updatedGroup.groupMembers.length} (Expected: 3)`);
    
    const m1 = updatedGroup.groupMembers.find(m => m._id.toString() === student1._id.toString());
    const m2 = updatedGroup.groupMembers.find(m => m._id.toString() === student2._id.toString());
    console.log(`- Student 1 memberStatus inside group: "${m1.memberStatus}" (Expected: "failed-part-I")`);
    console.log(`- Student 2 memberStatus inside group: "${m2.memberStatus}" (Expected: "active")`);

    if (updatedGroup.groupMembers.length === 3 && m1.memberStatus === "failed-part-I") {
      console.log("✓ VERIFIED: Failed student was NOT deleted from groupMembers and is preserved for history with status 'failed-part-I'.");
    } else {
      console.log("✗ FAILED: Database retention check failed.");
    }

    console.log("\n--- STEP 3: Verifying panel-member list filtration (getFypRegistrationsByPanelMember) ---");
    let fetchResStatus = null;
    let fetchResData = null;
    const mockFetchRes = {
      status(code) { fetchResStatus = code; return this; },
      json(data) { fetchResData = data; return this; }
    };
    await getFypRegistrationsByPanelMember({ params: { userId: supervisor._id.toString() } }, mockFetchRes);
    
    const supGroups = fetchResData.asSupervisor || [];
    const returnedGroup = supGroups.find(g => g._id.toString() === group._id.toString());
    console.log(`Group fetched via API: "${returnedGroup?.topicData?.topic}"`);
    console.log(`Group members count in API response: ${returnedGroup?.groupMembers?.length}`);
    if (returnedGroup && returnedGroup.groupMembers.length === 2) {
      console.log("✓ VERIFIED: The failed student was automatically filtered out of the API response, so panel members won't see or evaluate them.");
    } else {
      console.log("✗ FAILED: API response member filtration check failed.");
    }

    console.log("\n--- STEP 4: Verifying Part-II evaluation backend validation guard ---");
    const proposalPartIIExamType = new ExamType({ examName: "Proposal-II", shortCode: "V2-Proposal", examTypeFor: "All", portalCategory: "Midterm", defaultPart: "Part-II" });
    await proposalPartIIExamType.save();
    const proposalPartIIExam = new CreateExam({ Term: termB._id, ExamType: proposalPartIIExamType._id, ExamWeightage: 100, AnnouncedDate: new Date(), partStatus: "Part-II", portalCategory: "Midterm", department: dept._id, program: prog._id });
    await proposalPartIIExam.save();

    let evalResStatus = null;
    let evalResData = null;
    const mockEvalRes = {
      status(code) { evalResStatus = code; return this; },
      json(data) { evalResData = data; return this; }
    };

    // Attempting to evaluate Student 1 (failed student) in the Part-II exam
    const mockEvalReq = {
      body: {
        groupId: group._id.toString(),
        termId: termA._id.toString(),
        examId: proposalPartIIExam._id.toString(),
        examinerId: panelFaculty[0]._id.toString(),
        evaluations: [
          { studentId: student1._id.toString(), marks: 80 } // Grading the failed student
        ]
      }
    };

    await addEvaluationMarks(mockEvalReq, mockEvalRes);
    console.log(`Add Marks Response Status: ${evalResStatus}`);
    console.log(`Add Marks Response Data: ${JSON.stringify(evalResData)}`);

    if (evalResStatus === 400 && evalResData.error.includes("Failed students from Part-I cannot be evaluated in Part-II exams")) {
      console.log("✓ VERIFIED: Backend successfully blocked grading the failed student in the Part-II exam with a 400 Bad Request error.");
    } else {
      console.log("✗ FAILED: Backend validation guard failed.");
    }

    console.log("\n--- STEP 5: Verifying student dashboard term filtration (getFypData) ---");
    // Re-enroll Student 1 in Term B
    await GenUser.findByIdAndUpdate(student1._id, { $set: { term: termB._id, partStatus: "part-I" } });
    console.log("Student 1 re-enrolled in Term B.");

    let getFypResStatus = null;
    let getFypResData = null;
    const mockGetFypRes = {
      status(code) { getFypResStatus = code; return this; },
      json(data) { getFypResData = data; return this; }
    };
    
    // Call getFypData for student 1
    await getFypData({ query: { registrationNumber: student1.registrationNumber } }, mockGetFypRes);
    console.log(`getFypData Response Status: ${getFypResStatus}`);
    console.log(`getFypData Response Data:`, JSON.stringify(getFypResData));

    if (getFypResStatus === 404 && getFypResData.message === "FYP data not found") {
      console.log("✓ VERIFIED: The student no longer sees their old failed Term A group on their active dashboard, preventing duplicate project displays.");
    } else {
      console.log("✗ FAILED: Student dashboard filtration failed.");
    }

    // Clean up
    console.log("\nCleaning up database...");
    await GenUser.deleteMany({ email: { $in: testEmails } });
    await PanelDetails.deleteMany({ _id: panel._id });
    await FypRegistration.deleteMany({ _id: group._id });
    await FYPTerm.deleteMany({ _id: { $in: [termA._id, termB._id] } });
    await PassFailCriteria.deleteMany({ _id: criteria._id });
    await CreateExam.deleteMany({ _id: { $in: [proposalExam._id, proposalPartIIExam._id] } });
    await ExamType.deleteMany({ _id: { $in: [proposalExamType._id, proposalPartIIExamType._id] } });
    await Evaluation.deleteMany({ _id: evaluationDoc._id });

    console.log("Cleanup complete.");
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");

  } catch (error) {
    console.error("Test failed with error:", error);
    await mongoose.disconnect();
  }
}

run();
