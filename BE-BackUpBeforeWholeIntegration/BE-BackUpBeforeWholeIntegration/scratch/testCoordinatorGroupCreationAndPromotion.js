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

const { createReg } = require("../server/controllers/StudentCont/fypRegController");
const { promoteGroupsToPartII } = require("../server/controllers/CoordinatorController/TermContinuationController");

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("=============================================================");
    console.log("CONNECTED TO DATABASE. Starting Coordinator Group Registration & Promotion Test...");
    console.log("=============================================================\n");

    // Clean up
    const testSession = "TERM-CO-SIM";
    const testEmails = [
      "co_sup@example.com",
      ...Array.from({ length: 6 }, (_, i) => `co_fac_${i + 1}@example.com`),
      ...Array.from({ length: 9 }, (_, i) => `co_se_${i + 1}@example.com`),
      ...Array.from({ length: 9 }, (_, i) => `co_ai_${i + 1}@example.com`)
    ];

    await GenUser.deleteMany({ email: { $in: testEmails } });
    await FYPTerm.deleteMany({ sessionTerm: testSession });

    // 1. Seed Department & Programs
    let dept = await Department.findOne({ departmentName: "Computer Science" });
    if (!dept) {
      dept = new Department({ departmentName: "Computer Science" });
      await dept.save();
    }
    let progAI = await Program.findOne({ shortCode: "AI" }) || new Program({ programTitle: "Artificial Intelligence", shortCode: "AI", department: dept._id });
    await progAI.save();
    let progSE = await Program.findOne({ shortCode: "SE" }) || new Program({ programTitle: "Software Engineering", shortCode: "SE", department: dept._id });
    await progSE.save();

    // 2. Seed Term & Pass criteria
    const term = new FYPTerm({ sessionTerm: testSession, startDate: new Date("2026-02-01"), endDate: new Date("2026-06-30"), status: "activated" });
    await term.save();

    const criteria = new PassFailCriteria({ term: term._id, passingCriteria: 50 });
    await criteria.save();

    // 3. Seed Supervisor & Panels
    const supervisor = new GenUser({ name: "Co Supervisor", email: "co_sup@example.com", password: "password123", role: "faculty", department: dept._id });
    await supervisor.save();

    const panelFaculty = [];
    for (let i = 1; i <= 6; i++) {
      const fac = new GenUser({ name: `Co Faculty ${i}`, email: `co_fac_${i}@example.com`, password: "password123", role: "faculty", department: dept._id });
      await fac.save();
      panelFaculty.push(fac);
    }

    const panel1 = new PanelDetails({
      department: dept._id, term: term._id, panelCode: "CO-P-01", panelName: "Co Panel One",
      PanelMembers: [
        { member: panelFaculty[0]._id, role: "Panel Head" },
        { member: panelFaculty[1]._id, role: "Examiner" },
        { member: panelFaculty[2]._id, role: "Examiner" }
      ]
    });
    await panel1.save();

    const panel2 = new PanelDetails({
      department: dept._id, term: term._id, panelCode: "CO-P-02", panelName: "Co Panel Two",
      PanelMembers: [
        { member: panelFaculty[3]._id, role: "Panel Head" },
        { member: panelFaculty[4]._id, role: "Examiner" },
        { member: panelFaculty[5]._id, role: "Examiner" }
      ]
    });
    await panel2.save();

    // 4. Seed Students (9 SE, 9 AI)
    const seStudents = [];
    const aiStudents = [];
    for (let i = 1; i <= 9; i++) {
      const s = new GenUser({ name: `Co SE Stud ${i}`, email: `co_se_${i}@example.com`, password: "password123", role: "Student", department: dept._id, program: progSE._id, term: term._id, registrationNumber: `CO-REG-SE-0${i}`, partStatus: "part-I" });
      await s.save();
      seStudents.push(s);
    }
    for (let i = 1; i <= 9; i++) {
      const s = new GenUser({ name: `Co AI Stud ${i}`, email: `co_ai_${i}@example.com`, password: "password123", role: "Student", department: dept._id, program: progAI._id, term: term._id, registrationNumber: `CO-REG-AI-0${i}`, partStatus: "part-I" });
      await s.save();
      aiStudents.push(s);
    }

    let tech = await Technology.findOne({ techName: "Test Node.js" }) || new Technology({ techName: "Test Node.js", description: "Node" });
    await tech.save();
    let plat = await Platform.findOne({ platformName: "Test Web Platform" }) || new Platform({ platformName: "Test Web Platform" });
    await plat.save();

    // 5. REGISTRATION PHASE
    console.log("--- ACTION 1: Group Registration ---");
    
    // Group 1: Registered by invoking the actual createReg controller (simulating coordinator/student registration UI form submit)
    let regStatus = null;
    let regData = null;
    const mockRegRes = {
      status(code) { regStatus = code; return this; },
      json(data) { regData = data; return this; }
    };

    const mockRegReq = {
      body: {
        groupData: [
          { _id: seStudents[0]._id, name: seStudents[0].name, email: seStudents[0].email, registrationNumber: seStudents[0].registrationNumber, role: seStudents[0].role, department: dept._id, program: progSE._id, term: term._id, cnic: "123", address: "Addr", creditHours: 130, cgpa: 3.5, gpa: 3.5 },
          { _id: seStudents[1]._id, name: seStudents[1].name, email: seStudents[1].email, registrationNumber: seStudents[1].registrationNumber, role: seStudents[1].role, department: dept._id, program: progSE._id, term: term._id, cnic: "124", address: "Addr", creditHours: 130, cgpa: 3.5, gpa: 3.5 },
          { _id: seStudents[2]._id, name: seStudents[2].name, email: seStudents[2].email, registrationNumber: seStudents[2].registrationNumber, role: seStudents[2].role, department: dept._id, program: progSE._id, term: term._id, cnic: "125", address: "Addr", creditHours: 130, cgpa: 3.5, gpa: 3.5 }
        ],
        selectedOption: supervisor._id.toString(),
        selectedTechnology: tech._id.toString(),
        topicData: { topic: "Co-Created Project SE 1", description: "UI Manual Creation Test", category: "Web" },
        selectedPlatform: plat._id.toString(),
        reqStatus: "approved",
        user: seStudents[0]._id.toString(),
        term: term._id.toString()
      }
    };

    await createReg(mockRegReq, mockRegRes);
    console.log(`Group 1 registration controller response status: ${regStatus}`);
    
    const groupSE1 = regData.fypRegistration;
    console.log(`Group 1 ID: ${groupSE1._id}, Topic: "${groupSE1.topicData.topic}"`);

    // Assign panel 1 to Group 1
    await FypRegistration.findByIdAndUpdate(groupSE1._id, { $set: { assignedPanel: panel1 } });

    // Seed the other 5 groups directly (as in the baseline)
    const groups = [groupSE1];

    const groupSE2 = new FypRegistration({
      groupMembers: [seStudents[3], seStudents[4], seStudents[5]], selectedOption: supervisor._id, selectedTechnology: tech._id,
      topicData: { topic: "SE Group 2 Project", description: "SE-2 Description", category: "Web" },
      selectedPlatform: plat._id, reqStatus: "approved", user: seStudents[3]._id, term: term._id.toString(), assignedPanel: panel1
    });
    await groupSE2.save();
    groups.push(groupSE2);

    const groupSE3 = new FypRegistration({
      groupMembers: [seStudents[6], seStudents[7], seStudents[8]], selectedOption: supervisor._id, selectedTechnology: tech._id,
      topicData: { topic: "SE Group 3 Project", description: "SE-3 Description", category: "Web" },
      selectedPlatform: plat._id, reqStatus: "approved", user: seStudents[6]._id, term: term._id.toString(), assignedPanel: panel2
    });
    await groupSE3.save();
    groups.push(groupSE3);

    const groupAI1 = new FypRegistration({
      groupMembers: [aiStudents[0], aiStudents[1], aiStudents[2]], selectedOption: supervisor._id, selectedTechnology: tech._id,
      topicData: { topic: "AI Group 1 Project", description: "AI-1 Description", category: "AI" },
      selectedPlatform: plat._id, reqStatus: "approved", user: aiStudents[0]._id, term: term._id.toString(), assignedPanel: panel2
    });
    await groupAI1.save();
    groups.push(groupAI1);

    const groupAI2 = new FypRegistration({
      groupMembers: [aiStudents[3], aiStudents[4], aiStudents[5]], selectedOption: supervisor._id, selectedTechnology: tech._id,
      topicData: { topic: "AI Group 2 Project", description: "AI-2 Description", category: "AI" },
      selectedPlatform: plat._id, reqStatus: "approved", user: aiStudents[3]._id, term: term._id.toString(), assignedPanel: panel1
    });
    await groupAI2.save();
    groups.push(groupAI2);

    const groupAI3 = new FypRegistration({
      groupMembers: [aiStudents[6], aiStudents[7], aiStudents[8]], selectedOption: supervisor._id, selectedTechnology: tech._id,
      topicData: { topic: "AI Group 3 Project", description: "AI-3 Description", category: "AI" },
      selectedPlatform: plat._id, reqStatus: "approved", user: aiStudents[6]._id, term: term._id.toString(), assignedPanel: panel2
    });
    await groupAI3.save();
    groups.push(groupAI3);

    console.log("Remaining 5 groups seeded successfully.");

    // 6. Seed Exams
    const examTypes = [];
    const examNames = ["Proposal", "Mid-I", "Final-I", "Attendance-I"];
    const weightages = [20, 20, 40, 20];
    const categories = ["Midterm", "Midterm", "Final", "Attendance"];

    for (let i = 0; i < 4; i++) {
      const name = examNames[i];
      let et = await ExamType.findOne({ shortCode: `CO-ET-${name}` });
      if (!et) {
        et = new ExamType({ examName: name, shortCode: `CO-ET-${name}`, examTypeFor: name === "Attendance-I" ? "Supervisor" : "All", portalCategory: categories[i], defaultPart: "Part-I" });
        await et.save();
      }
      examTypes.push(et);
    }

    const seExams = [];
    const aiExams = [];
    for (let i = 0; i < 4; i++) {
      const seExam = new CreateExam({ Term: term._id, ExamType: examTypes[i]._id, ExamWeightage: weightages[i], AnnouncedDate: new Date(), partStatus: "Part-I", portalCategory: categories[i], department: dept._id, program: progSE._id });
      await seExam.save();
      seExams.push(seExam);

      const aiExam = new CreateExam({ Term: term._id, ExamType: examTypes[i]._id, ExamWeightage: weightages[i], AnnouncedDate: new Date(), partStatus: "Part-I", portalCategory: categories[i], department: dept._id, program: progAI._id });
      await aiExam.save();
      aiExams.push(aiExam);
    }

    // 7. Seed Evaluation Marks
    const buildStudentEval = (studentId, obtainedAverage) => ({
      studentId, obtainedAverage, evaluationsByExaminers: [{ examinerId: panelFaculty[0]._id, marks: obtainedAverage }], marks: obtainedAverage
    });
    const buildGroupEval = (groupId, panelId, studentsEvals) => ({ groupId, panelId, students: studentsEvals, approvedStatus: "approved" });
    const buildExamSchema = (examId, examName, groupEvals) => ({ examId, examTypeFor: examName === "Attendance-I" ? "Supervisor" : "All", examName, fypGroups: groupEvals });

    const examsEvaluationData = [];
    for (let i = 0; i < 4; i++) {
      const examName = examNames[i];
      const examSE = seExams[i];
      const examAI = aiExams[i];

      const seGroupEvals = [
        buildGroupEval(groupSE1._id, panel1._id, [
          buildStudentEval(seStudents[0]._id, 10), // Student 1 fails
          buildStudentEval(seStudents[1]._id, 18),
          buildStudentEval(seStudents[2]._id, 18)
        ]),
        buildGroupEval(groupSE2._id, panel1._id, [
          buildStudentEval(seStudents[3]._id, 18),
          buildStudentEval(seStudents[4]._id, 18),
          buildStudentEval(seStudents[5]._id, 18)
        ]),
        buildGroupEval(groupSE3._id, panel2._id, [
          buildStudentEval(seStudents[6]._id, 10),
          buildStudentEval(seStudents[7]._id, 10),
          buildStudentEval(seStudents[8]._id, 10)
        ])
      ];

      const aiGroupEvals = [
        buildGroupEval(groupAI1._id, panel2._id, [
          buildStudentEval(aiStudents[0]._id, 10), // Student 1 fails
          buildStudentEval(aiStudents[1]._id, 18),
          buildStudentEval(aiStudents[2]._id, 18)
        ]),
        buildGroupEval(groupAI2._id, panel1._id, [
          buildStudentEval(aiStudents[3]._id, 18),
          buildStudentEval(aiStudents[4]._id, 18),
          buildStudentEval(aiStudents[5]._id, 18)
        ]),
        buildGroupEval(groupAI3._id, panel2._id, [
          buildStudentEval(aiStudents[6]._id, 10),
          buildStudentEval(aiStudents[7]._id, 10),
          buildStudentEval(aiStudents[8]._id, 10)
        ])
      ];

      examsEvaluationData.push(buildExamSchema(examSE._id, examName, seGroupEvals));
      examsEvaluationData.push(buildExamSchema(examAI._id, examName, aiGroupEvals));
    }

    const evaluationDoc = new Evaluation({
      supervisorId: supervisor._id,
      terms: [{ termId: term._id, exams: examsEvaluationData }],
      uploadedBy: supervisor._id
    });
    await evaluationDoc.save();

    console.log("\n--- ACTION 2: Running Promotion (Continuation) ---");
    let promoStatus = null;
    let promoData = null;
    const mockPromoRes = {
      status(code) { promoStatus = code; return this; },
      json(data) { promoData = data; return this; }
    };
    await promoteGroupsToPartII({ body: { termId: term._id.toString() } }, mockPromoRes);
    console.log(`Promotion controller response status: ${promoStatus}`);

    // Inspect Group 1 outcome
    console.log("\n--- ACTION 3: Inspecting Group 1 (Coordinator-Created Group) ---");
    const promotedGroup1 = await FypRegistration.findById(groupSE1._id);
    console.log(`Group 1 Topic: "${promotedGroup1.topicData.topic}"`);
    console.log(`Group 1 Term: ${promotedGroup1.term}`);
    console.log(`Group 1 Status after continuation: "${promotedGroup1.partStatus}" (Expected: "part-II")`);
    console.log(`Group 1 Members Count in DB: ${promotedGroup1.groupMembers.length} (Expected: 3 - with failed student retained)`);

    const failMem = promotedGroup1.groupMembers.find(m => m._id.toString() === seStudents[0]._id.toString());
    const passMem1 = promotedGroup1.groupMembers.find(m => m._id.toString() === seStudents[1]._id.toString());
    console.log(`- Member 1 (failed) status inside group: "${failMem.memberStatus}" (Expected: "failed-part-I")`);
    console.log(`- Member 2 (passed) status inside group: "${passMem1.memberStatus}" (Expected: "active")`);

    if (promotedGroup1.partStatus === "part-II" && failMem.memberStatus === "failed-part-I") {
      console.log("\n>>> SUCCESS: COORDINATOR-CREATED GROUP SUCCESSFULLY PROMOTED TO PART-II WITH FAILED STUDENT PRESERVED!");
    } else {
      console.log("\n>>> FAILURE: GROUP PROMOTION CHECK FAILED!");
    }

    // Clean up
    console.log("\n--- CLEANING UP SIMULATION DATA ---");
    await GenUser.deleteMany({ email: { $in: testEmails } });
    await PanelDetails.deleteMany({ _id: { $in: [panel1._id, panel2._id] } });
    await FypRegistration.deleteMany({ _id: { $in: groups.map(g => g._id) } });
    await FYPTerm.deleteMany({ _id: term._id });
    await PassFailCriteria.deleteMany({ _id: criteria._id });
    await CreateExam.deleteMany({ _id: { $in: [...seExams.map(e => e._id), ...aiExams.map(e => e._id)] } });
    await ExamType.deleteMany({ _id: { $in: examTypes.map(e => e._id) } });
    await Evaluation.deleteMany({ _id: evaluationDoc._id });

    console.log("Cleanup completed.");
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");

  } catch (error) {
    console.error("Test execution failed with error:", error);
    await mongoose.disconnect();
  }
}

run();
