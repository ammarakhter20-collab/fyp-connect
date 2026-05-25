const mongoose = require("mongoose");
process.env.TOKEN_KEY = "testsecretkey"; // Required for createGenUser JWT generation

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
const { createGenUser, deleteStudent } = require("../server/controllers/AdminCont/GenUserController");

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("=============================================================");
    console.log("CONNECTED TO DATABASE. Starting Failed Student Re-registration Simulation...");
    console.log("=============================================================\n");

    // Clean up any remnants from previous failed runs first
    const cleanEmails = [
      "sim_sup@example.com",
      ...Array.from({ length: 6 }, (_, i) => `fac_${i + 1}@example.com`),
      ...Array.from({ length: 9 }, (_, i) => `se_stud_${i + 1}@example.com`),
      ...Array.from({ length: 9 }, (_, i) => `ai_stud_${i + 1}@example.com`),
      "new_se_stud_1@example.com"
    ];
    await GenUser.deleteMany({ email: { $in: cleanEmails } });
    await FYPTerm.deleteMany({ sessionTerm: { $in: ["TERM-2025-A", "TERM-2026-B"] } });

    // 1. Seed Department & Programs
    let dept = await Department.findOne({ departmentName: "Computer Science" });
    if (!dept) {
      dept = new Department({ departmentName: "Computer Science" });
      await dept.save();
    }
    let progAI = await Program.findOne({ shortCode: "AI" });
    if (!progAI) {
      progAI = new Program({ programTitle: "Artificial Intelligence", shortCode: "AI", department: dept._id });
      await progAI.save();
    }
    let progSE = await Program.findOne({ shortCode: "SE" });
    if (!progSE) {
      progSE = new Program({ programTitle: "Software Engineering", shortCode: "SE", department: dept._id });
      await progSE.save();
    }

    // 2. Seed Terms (Term A for old, Term B for new)
    const termA = new FYPTerm({
      sessionTerm: "TERM-2025-A",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-01-31"),
      status: "deactivated"
    });
    await termA.save();

    const termB = new FYPTerm({
      sessionTerm: "TERM-2026-B",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-06-30"),
      status: "activated"
    });
    await termB.save();

    // 3. Seed Pass criteria for Term A
    const criteria = new PassFailCriteria({
      term: termA._id,
      passingCriteria: 50
    });
    await criteria.save();

    // 4. Seed supervisor and panels
    const supervisor = new GenUser({
      name: "Sim Sup",
      email: "sim_sup@example.com",
      password: "password123",
      role: "faculty",
      department: dept._id
    });
    await supervisor.save();

    const panelFaculty = [];
    for (let i = 1; i <= 6; i++) {
      const fac = new GenUser({
        name: `Faculty ${i}`,
        email: `fac_${i}@example.com`,
        password: "password123",
        role: "faculty",
        department: dept._id
      });
      await fac.save();
      panelFaculty.push(fac);
    }

    const panel1 = new PanelDetails({
      department: dept._id,
      term: termA._id,
      panelCode: "P-1",
      panelName: "Panel One",
      PanelMembers: [
        { member: panelFaculty[0]._id, role: "Panel Head" },
        { member: panelFaculty[1]._id, role: "Examiner" },
        { member: panelFaculty[2]._id, role: "Examiner" }
      ]
    });
    await panel1.save();

    const panel2 = new PanelDetails({
      department: dept._id,
      term: termA._id,
      panelCode: "P-2",
      panelName: "Panel Two",
      PanelMembers: [
        { member: panelFaculty[3]._id, role: "Panel Head" },
        { member: panelFaculty[4]._id, role: "Examiner" },
        { member: panelFaculty[5]._id, role: "Examiner" }
      ]
    });
    await panel2.save();

    // 5. Seed Students (9 SE, 9 AI) in Term A
    const seStudents = [];
    const aiStudents = [];

    for (let i = 1; i <= 9; i++) {
      const stud = new GenUser({
        name: `SE Student ${i}`,
        email: `se_stud_${i}@example.com`,
        password: "password123",
        role: "Student",
        department: dept._id,
        program: progSE._id,
        term: termA._id,
        registrationNumber: `REG-SE-${i}`,
        partStatus: "part-I"
      });
      await stud.save();
      seStudents.push(stud);
    }

    for (let i = 1; i <= 9; i++) {
      const stud = new GenUser({
        name: `AI Student ${i}`,
        email: `ai_stud_${i}@example.com`,
        password: "password123",
        role: "Student",
        department: dept._id,
        program: progAI._id,
        term: termA._id,
        registrationNumber: `REG-AI-${i}`,
        partStatus: "part-I"
      });
      await stud.save();
      aiStudents.push(stud);
    }

    // 6. Seed Groups
    let tech = await Technology.findOne({ techName: "Test Node.js" });
    if (!tech) {
      tech = new Technology({ techName: "Test Node.js", description: "Node" });
      await tech.save();
    }
    let plat = await Platform.findOne({ platformName: "Test Web Platform" });
    if (!plat) {
      plat = new Platform({ platformName: "Test Web Platform" });
      await plat.save();
    }

    const groups = [];

    const groupSE1 = new FypRegistration({
      groupMembers: [seStudents[0], seStudents[1], seStudents[2]],
      selectedOption: supervisor._id,
      selectedTechnology: tech._id,
      topicData: { topic: "SE Group 1 Project", description: "SE-1 Description", category: "Web" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: seStudents[0]._id,
      term: termA._id.toString(),
      assignedPanel: panel1
    });
    await groupSE1.save();
    groups.push(groupSE1);

    const groupSE2 = new FypRegistration({
      groupMembers: [seStudents[3], seStudents[4], seStudents[5]],
      selectedOption: supervisor._id,
      selectedTechnology: tech._id,
      topicData: { topic: "SE Group 2 Project", description: "SE-2 Description", category: "Web" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: seStudents[3]._id,
      term: termA._id.toString(),
      assignedPanel: panel1
    });
    await groupSE2.save();
    groups.push(groupSE2);

    const groupSE3 = new FypRegistration({
      groupMembers: [seStudents[6], seStudents[7], seStudents[8]],
      selectedOption: supervisor._id,
      selectedTechnology: tech._id,
      topicData: { topic: "SE Group 3 Project", description: "SE-3 Description", category: "Web" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: seStudents[6]._id,
      term: termA._id.toString(),
      assignedPanel: panel2
    });
    await groupSE3.save();
    groups.push(groupSE3);

    const groupAI1 = new FypRegistration({
      groupMembers: [aiStudents[0], aiStudents[1], aiStudents[2]],
      selectedOption: supervisor._id,
      selectedTechnology: tech._id,
      topicData: { topic: "AI Group 1 Project", description: "AI-1 Description", category: "AI" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: aiStudents[0]._id,
      term: termA._id.toString(),
      assignedPanel: panel2
    });
    await groupAI1.save();
    groups.push(groupAI1);

    const groupAI2 = new FypRegistration({
      groupMembers: [aiStudents[3], aiStudents[4], aiStudents[5]],
      selectedOption: supervisor._id,
      selectedTechnology: tech._id,
      topicData: { topic: "AI Group 2 Project", description: "AI-2 Description", category: "AI" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: aiStudents[3]._id,
      term: termA._id.toString(),
      assignedPanel: panel1
    });
    await groupAI2.save();
    groups.push(groupAI2);

    const groupAI3 = new FypRegistration({
      groupMembers: [aiStudents[6], aiStudents[7], aiStudents[8]],
      selectedOption: supervisor._id,
      selectedTechnology: tech._id,
      topicData: { topic: "AI Group 3 Project", description: "AI-3 Description", category: "AI" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: aiStudents[6]._id,
      term: termA._id.toString(),
      assignedPanel: panel2
    });
    await groupAI3.save();
    groups.push(groupAI3);

    // 7. Seed Exams
    const examTypes = [];
    const examNames = ["Proposal", "Mid-I", "Final-I", "Attendance-I"];
    const weightages = [20, 20, 40, 20];
    const categories = ["Midterm", "Midterm", "Final", "Attendance"];

    for (let i = 0; i < 4; i++) {
      const name = examNames[i];
      let et = await ExamType.findOne({ shortCode: `TEST-ET-${name}` });
      if (!et) {
        et = new ExamType({
          examName: name,
          shortCode: `TEST-ET-${name}`,
          examTypeFor: name === "Attendance-I" ? "Supervisor" : "All",
          portalCategory: categories[i],
          defaultPart: "Part-I"
        });
        await et.save();
      }
      examTypes.push(et);
    }

    const seExams = [];
    const aiExams = [];

    for (let i = 0; i < 4; i++) {
      const seExam = new CreateExam({
        Term: termA._id,
        ExamType: examTypes[i]._id,
        ExamWeightage: weightages[i],
        AnnouncedDate: new Date(),
        partStatus: "Part-I",
        portalCategory: categories[i],
        department: dept._id,
        program: progSE._id
      });
      await seExam.save();
      seExams.push(seExam);

      const aiExam = new CreateExam({
        Term: termA._id,
        ExamType: examTypes[i]._id,
        ExamWeightage: weightages[i],
        AnnouncedDate: new Date(),
        partStatus: "Part-I",
        portalCategory: categories[i],
        department: dept._id,
        program: progAI._id
      });
      await aiExam.save();
      aiExams.push(aiExam);
    }

    // 8. Seed Evaluation Marks
    const buildStudentEval = (studentId, obtainedAverage) => ({
      studentId,
      obtainedAverage,
      evaluationsByExaminers: [{ examinerId: panelFaculty[0]._id, marks: obtainedAverage }],
      marks: obtainedAverage
    });

    const buildGroupEval = (groupId, panelId, studentsEvals) => ({
      groupId,
      panelId,
      students: studentsEvals,
      approvedStatus: "approved"
    });

    const buildExamSchema = (examId, examName, groupEvals) => ({
      examId,
      examTypeFor: examName === "Attendance-I" ? "Supervisor" : "All",
      examName,
      fypGroups: groupEvals
    });

    const examsEvaluationData = [];
    for (let i = 0; i < 4; i++) {
      const examName = examNames[i];
      const examSE = seExams[i];
      const examAI = aiExams[i];

      const seGroupEvals = [
        buildGroupEval(groupSE1._id, panel1._id, [
          buildStudentEval(seStudents[0]._id, 10), // fails
          buildStudentEval(seStudents[1]._id, 18),
          buildStudentEval(seStudents[2]._id, 18)
        ]),
        buildGroupEval(groupSE2._id, panel1._id, [
          buildStudentEval(seStudents[3]._id, 18),
          buildStudentEval(seStudents[4]._id, 18),
          buildStudentEval(seStudents[5]._id, 18)
        ]),
        buildGroupEval(groupSE3._id, panel2._id, [
          buildStudentEval(seStudents[6]._id, 10), // fails
          buildStudentEval(seStudents[7]._id, 10), // fails
          buildStudentEval(seStudents[8]._id, 10)  // fails
        ])
      ];

      const aiGroupEvals = [
        buildGroupEval(groupAI1._id, panel2._id, [
          buildStudentEval(aiStudents[0]._id, 10), // fails
          buildStudentEval(aiStudents[1]._id, 18),
          buildStudentEval(aiStudents[2]._id, 18)
        ]),
        buildGroupEval(groupAI2._id, panel1._id, [
          buildStudentEval(aiStudents[3]._id, 18),
          buildStudentEval(aiStudents[4]._id, 18),
          buildStudentEval(aiStudents[5]._id, 18)
        ]),
        buildGroupEval(groupAI3._id, panel2._id, [
          buildStudentEval(aiStudents[6]._id, 10), // fails
          buildStudentEval(aiStudents[7]._id, 10), // fails
          buildStudentEval(aiStudents[8]._id, 10)  // fails
        ])
      ];

      examsEvaluationData.push(buildExamSchema(examSE._id, examName, seGroupEvals));
      examsEvaluationData.push(buildExamSchema(examAI._id, examName, aiGroupEvals));
    }

    const evaluationDoc = new Evaluation({
      supervisorId: supervisor._id,
      terms: [{
        termId: termA._id,
        exams: examsEvaluationData
      }],
      uploadedBy: supervisor._id
    });
    await evaluationDoc.save();

    // 9. Run Promotion Logic
    console.log("--- RUNNING CONTINUATION PROMOTION LOGIC FOR TERM A ---");
    let promoResStatus = null;
    let promoResData = null;
    const mockPromoRes = {
      status(code) { promoResStatus = code; return this; },
      json(data) { promoResData = data; return this; }
    };
    await promoteGroupsToPartII({ body: { termId: termA._id.toString() } }, mockPromoRes);
    console.log(`Continuation promotion complete. Status: ${promoResStatus}`);

    // Verify Failed Student states
    const failedSEStudent1 = await GenUser.findById(seStudents[0]._id);
    const failedSEStudent7 = await GenUser.findById(seStudents[6]._id);
    console.log(`\nFailed SE Student 1 (partial-fail group) state: partStatus="${failedSEStudent1.partStatus}", term=${failedSEStudent1.term}`);
    console.log(`Failed SE Student 7 (whole-failed group) state: partStatus="${failedSEStudent7.partStatus}", term=${failedSEStudent7.term}`);

    // 10. TEST DIRECT RE-CREATION (EXPECTED FAIL)
    console.log("\n=============================================================");
    console.log("TESTING RE-REGISTRATION: WHAT HAPPENS IF WE TRY TO CREATE THEM ANEW?");
    console.log("=============================================================");
    let createResStatus = null;
    let createResData = null;
    const mockCreateRes = {
      status(code) { createResStatus = code; return this; },
      json(data) { createResData = data; return this; }
    };

    // Attempting to register failed student 1 as a new record in Term B
    const mockCreateReq = {
      body: {
        name: "New SE Student 1",
        email: "se_stud_1@example.com", // same email
        role: "Student",
        department: dept._id.toString(),
        program: progSE._id.toString(),
        term: termB._id.toString(),
        password: "newpassword123",
        registrationNumber: "REG-SE-1" // same reg number
      }
    };

    await createGenUser(mockCreateReq, mockCreateRes);
    console.log(`Creation response status: ${createResStatus}`);
    console.log(`Creation response: ${JSON.stringify(createResData)}`);

    if (createResStatus === 400 && createResData.error.includes("duplicate key error")) {
      console.log("\n>>> SUCCESS: DIRECT RE-CREATION FAILS DUE TO UNIQUE KEY CONSTRAINTS (E11000) <<<");
      console.log("This proves they cannot be registered as new records without cleaning up or updating.");
    } else {
      console.log("\n>>> FAILURE: DIRECT RE-CREATION DID NOT FAIL AS EXPECTED! <<<");
    }

    // 11. TESTING METHOD A: CASCADING DELETE + NEW REGISTRATION
    console.log("\n=============================================================");
    console.log("TESTING RE-REGISTRATION METHOD A: CASCADING DELETE + NEW REGISTRATION");
    console.log("=============================================================");
    // Delete the student record
    let deleteResStatus = null;
    const mockDeleteRes = {
      status(code) { deleteResStatus = code; return this; },
      json(data) { return this; }
    };
    await deleteStudent({ body: { studentId: failedSEStudent1._id.toString() } }, mockDeleteRes);
    console.log(`Cascading deletion of Student 1 completed. Status: ${deleteResStatus}`);

    // Now try registration again
    createResStatus = null;
    createResData = null;
    await createGenUser(mockCreateReq, mockCreateRes);
    console.log(`Re-creation response status: ${createResStatus}`);
    if (createResStatus === 200) {
      console.log(`Re-created Student ID: ${createResData?.user?._id}, term: ${createResData?.user?.term}`);
      console.log("\n>>> SUCCESS: METHOD A (CASCADING DELETE + NEW REGISTRATION) WORKS! <<<");
    } else {
      console.log("\n>>> FAILURE: METHOD A DID NOT WORK! <<<");
    }

    // 12. TESTING METHOD B: DIRECT PROFILE UPDATE / RE-ENROLLMENT
    console.log("\n=============================================================");
    console.log("TESTING RE-REGISTRATION METHOD B: DIRECT PROFILE UPDATE (RECOMMENDED)");
    console.log("=============================================================");
    console.log(`Original Student 7 Term ID in DB: ${failedSEStudent7.term} (Expected: null)`);
    
    // Admin directly updates term and partStatus of the existing failed student record
    const reEnrolledStudent7 = await GenUser.findByIdAndUpdate(
      failedSEStudent7._id,
      {
        $set: {
          term: termB._id,
          partStatus: "part-I"
        }
      },
      { new: true }
    );

    console.log(`Updated Student 7 in DB: term=${reEnrolledStudent7.term}, partStatus="${reEnrolledStudent7.partStatus}"`);
    if (reEnrolledStudent7.term.toString() === termB._id.toString() && reEnrolledStudent7.partStatus === "part-I") {
      console.log("\n>>> SUCCESS: METHOD B (DIRECT PROFILE UPDATE / RE-ENROLL) WORKS PERFECTLY! <<<");
      console.log("The student is enrolled in the new term with no duplicate errors, preserving historical record.");
    } else {
      console.log("\n>>> FAILURE: METHOD B DID NOT UPDATE CORRECTLY! <<<");
    }

    // 13. Cleanup everything
    console.log("\n--- CLEANING UP SIMULATION DATA ---");
    await GenUser.deleteMany({ email: { $in: cleanEmails } });
    await PanelDetails.deleteMany({ _id: { $in: [panel1._id, panel2._id] } });
    await FypRegistration.deleteMany({ _id: { $in: groups.map(g => g._id) } });
    await FYPTerm.deleteMany({ _id: { $in: [termA._id, termB._id] } });
    await PassFailCriteria.deleteMany({ _id: criteria._id });
    await CreateExam.deleteMany({ _id: { $in: [...seExams.map(e => e._id), ...aiExams.map(e => e._id)] } });
    await StudentReport.deleteMany({ FYPGroup: { $in: groups.map(g => g._id) } });
    await Evaluation.deleteMany({ _id: evaluationDoc._id });

    console.log("Cleanup completed.");
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");

  } catch (err) {
    console.error("Test scenario failed with error:", err);
    await mongoose.disconnect();
  }
}

run();
