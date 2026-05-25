const mongoose = require("mongoose");
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

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("=============================================================");
    console.log("CONNECTED TO DATABASE. Starting Part-II Evaluation Check...");
    console.log("=============================================================\n");

    // 1. SEED DEPARTMENT
    let dept = await Department.findOne({ departmentName: "Computer Science" });
    if (!dept) {
      dept = new Department({ departmentName: "Computer Science" });
      await dept.save();
    }

    // 2. SEED PROGRAMS
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

    // 3. SEED TERM & PASS CRITERIA
    const termSession = "SIM-TERM-PART-II";
    await FYPTerm.deleteMany({ sessionTerm: termSession });
    const term = new FYPTerm({
      sessionTerm: termSession,
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-06-30"),
      status: "activated"
    });
    await term.save();

    await PassFailCriteria.deleteMany({ term: term._id });
    const criteria = new PassFailCriteria({
      term: term._id,
      passingCriteria: 50
    });
    await criteria.save();

    // 4. SEED SUPERVISOR & PANELS
    const supervisor = new GenUser({
      name: "Sim Supervisor II",
      email: "sim_supervisor_ii@example.com",
      password: "password123",
      role: "faculty",
      department: dept._id
    });
    await supervisor.save();

    // Create 6 Panel Members (Faculty)
    const panelFaculty = [];
    for (let i = 1; i <= 6; i++) {
      const faculty = new GenUser({
        name: `Faculty Member ${i}`,
        email: `fac_member_ii_${i}@example.com`,
        password: "password123",
        role: "faculty",
        department: dept._id
      });
      await faculty.save();
      panelFaculty.push(faculty);
    }

    // Seed 2 Panels
    const panel1 = new PanelDetails({
      department: dept._id,
      term: term._id,
      panelCode: "PANEL-SIM-II-01",
      panelName: "Simulation Panel One II",
      PanelMembers: [
        { member: panelFaculty[0]._id, role: "Panel Head" },
        { member: panelFaculty[1]._id, role: "Examiner" },
        { member: panelFaculty[2]._id, role: "Examiner" }
      ]
    });
    await panel1.save();

    const panel2 = new PanelDetails({
      department: dept._id,
      term: term._id,
      panelCode: "PANEL-SIM-II-02",
      panelName: "Simulation Panel Two II",
      PanelMembers: [
        { member: panelFaculty[3]._id, role: "Panel Head" },
        { member: panelFaculty[4]._id, role: "Examiner" },
        { member: panelFaculty[5]._id, role: "Examiner" }
      ]
    });
    await panel2.save();

    // 5. SEED STUDENTS (18 students: 9 SE, 9 AI)
    const seStudents = [];
    const aiStudents = [];

    for (let i = 1; i <= 9; i++) {
      const student = new GenUser({
        name: `SE Student ${i}`,
        email: `se_student_ii_${i}@example.com`,
        password: "password123",
        role: "Student",
        department: dept._id,
        program: progSE._id,
        term: term._id,
        registrationNumber: `REG-SE-II-00${i}`,
        partStatus: "part-I"
      });
      await student.save();
      seStudents.push(student);
    }

    for (let i = 1; i <= 9; i++) {
      const student = new GenUser({
        name: `AI Student ${i}`,
        email: `ai_student_ii_${i}@example.com`,
        password: "password123",
        role: "Student",
        department: dept._id,
        program: progAI._id,
        term: term._id,
        registrationNumber: `REG-AI-II-00${i}`,
        partStatus: "part-I"
      });
      await student.save();
      aiStudents.push(student);
    }

    // 6. SEED FYP GROUPS (6 Groups, each with 3 members)
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

    // SE Group 1 (1 student failed, 2 passed)
    const groupSE1 = new FypRegistration({
      groupMembers: [seStudents[0], seStudents[1], seStudents[2]],
      selectedOption: supervisor._id,
      selectedTechnology: tech._id,
      topicData: { topic: "SE Group 1 Project", description: "SE-1 Description", category: "Web" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: seStudents[0]._id,
      term: term._id.toString(),
      assignedPanel: panel1
    });
    await groupSE1.save();
    groups.push(groupSE1);

    // SE Group 2 (All cleared with good marks)
    const groupSE2 = new FypRegistration({
      groupMembers: [seStudents[3], seStudents[4], seStudents[5]],
      selectedOption: supervisor._id,
      selectedTechnology: tech._id,
      topicData: { topic: "SE Group 2 Project", description: "SE-2 Description", category: "Web" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: seStudents[3]._id,
      term: term._id.toString(),
      assignedPanel: panel1
    });
    await groupSE2.save();
    groups.push(groupSE2);

    // SE Group 3 (All failed - whole group failed)
    const groupSE3 = new FypRegistration({
      groupMembers: [seStudents[6], seStudents[7], seStudents[8]],
      selectedOption: supervisor._id,
      selectedTechnology: tech._id,
      topicData: { topic: "SE Group 3 Project", description: "SE-3 Description", category: "Web" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: seStudents[6]._id,
      term: term._id.toString(),
      assignedPanel: panel2
    });
    await groupSE3.save();
    groups.push(groupSE3);

    // AI Group 1 (1 student failed, 2 passed)
    const groupAI1 = new FypRegistration({
      groupMembers: [aiStudents[0], aiStudents[1], aiStudents[2]],
      selectedOption: supervisor._id,
      selectedTechnology: tech._id,
      topicData: { topic: "AI Group 1 Project", description: "AI-1 Description", category: "AI" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: aiStudents[0]._id,
      term: term._id.toString(),
      assignedPanel: panel2
    });
    await groupAI1.save();
    groups.push(groupAI1);

    // AI Group 2 (All cleared with good marks)
    const groupAI2 = new FypRegistration({
      groupMembers: [aiStudents[3], aiStudents[4], aiStudents[5]],
      selectedOption: supervisor._id,
      selectedTechnology: tech._id,
      topicData: { topic: "AI Group 2 Project", description: "AI-2 Description", category: "AI" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: aiStudents[3]._id,
      term: term._id.toString(),
      assignedPanel: panel1
    });
    await groupAI2.save();
    groups.push(groupAI2);

    // AI Group 3 (All failed - whole group failed)
    const groupAI3 = new FypRegistration({
      groupMembers: [aiStudents[6], aiStudents[7], aiStudents[8]],
      selectedOption: supervisor._id,
      selectedTechnology: tech._id,
      topicData: { topic: "AI Group 3 Project", description: "AI-3 Description", category: "AI" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: aiStudents[6]._id,
      term: term._id.toString(),
      assignedPanel: panel2
    });
    await groupAI3.save();
    groups.push(groupAI3);

    // 7. SEED PART-I EXAMS & MARKS
    const examTypes = [];
    const examNames = ["Proposal", "Mid-I", "Final-I", "Attendance-I"];
    const weightages = [20, 20, 40, 20];
    const categories = ["Midterm", "Midterm", "Final", "Attendance"];

    for (let i = 0; i < 4; i++) {
      const name = examNames[i];
      let et = await ExamType.findOne({ shortCode: `SIM-ET-II-${name}` });
      if (!et) {
        et = new ExamType({
          examName: name,
          shortCode: `SIM-ET-II-${name}`,
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
        Term: term._id,
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
        Term: term._id,
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

    // Seed evaluation marks
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
          buildStudentEval(seStudents[0]._id, 10), // Fails
          buildStudentEval(seStudents[1]._id, 18), // Passes
          buildStudentEval(seStudents[2]._id, 18)  // Passes
        ]),
        buildGroupEval(groupSE2._id, panel1._id, [
          buildStudentEval(seStudents[3]._id, 18),
          buildStudentEval(seStudents[4]._id, 18),
          buildStudentEval(seStudents[5]._id, 18)
        ]),
        buildGroupEval(groupSE3._id, panel2._id, [
          buildStudentEval(seStudents[6]._id, 10), // Fails
          buildStudentEval(seStudents[7]._id, 10), // Fails
          buildStudentEval(seStudents[8]._id, 10)  // Fails
        ])
      ];

      const aiGroupEvals = [
        buildGroupEval(groupAI1._id, panel2._id, [
          buildStudentEval(aiStudents[0]._id, 10), // Fails
          buildStudentEval(aiStudents[1]._id, 18), // Passes
          buildStudentEval(aiStudents[2]._id, 18)  // Passes
        ]),
        buildGroupEval(groupAI2._id, panel1._id, [
          buildStudentEval(aiStudents[3]._id, 18),
          buildStudentEval(aiStudents[4]._id, 18),
          buildStudentEval(aiStudents[5]._id, 18)
        ]),
        buildGroupEval(groupAI3._id, panel2._id, [
          buildStudentEval(aiStudents[6]._id, 10), // Fails
          buildStudentEval(aiStudents[7]._id, 10), // Fails
          buildStudentEval(aiStudents[8]._id, 10)  // Fails
        ])
      ];

      examsEvaluationData.push(buildExamSchema(examSE._id, examName, seGroupEvals));
      examsEvaluationData.push(buildExamSchema(examAI._id, examName, aiGroupEvals));
    }

    const evaluationDoc = new Evaluation({
      supervisorId: supervisor._id,
      terms: [{
        termId: term._id,
        exams: examsEvaluationData
      }],
      uploadedBy: supervisor._id
    });
    await evaluationDoc.save();

    // 8. EXECUTE PROMOTION TO PART II
    console.log("--- PROMOTING GROUPS TO PART II ---");
    let responseStatus = null;
    let responseData = null;
    const mockRes = {
      status(code) {
        responseStatus = code;
        return this;
      },
      json(data) {
        responseData = data;
        return this;
      }
    };
    const mockReq = {
      body: {
        termId: term._id.toString()
      }
    };

    await promoteGroupsToPartII(mockReq, mockRes);
    console.log(`Continuation Promotion Response: ${responseData?.message}\n`);

    // 9. CREATE PART II EXAMS
    // Create new exam types for Part II
    const examTypesPartII = [];
    const examNamesPartII = ["Proposal-II", "Mid-II", "Final-II", "Attendance-II"];
    for (let i = 0; i < 4; i++) {
      const name = examNamesPartII[i];
      let et = await ExamType.findOne({ shortCode: `SIM-ET-II-${name}` });
      if (!et) {
        et = new ExamType({
          examName: name,
          shortCode: `SIM-ET-II-${name}`,
          examTypeFor: name === "Attendance-II" ? "Supervisor" : "All",
          portalCategory: categories[i],
          defaultPart: "Part-II"
        });
        await et.save();
      }
      examTypesPartII.push(et);
    }

    const seExamsPartII = [];
    const aiExamsPartII = [];
    for (let i = 0; i < 4; i++) {
      const seExam = new CreateExam({
        Term: term._id,
        ExamType: examTypesPartII[i]._id,
        ExamWeightage: weightages[i],
        AnnouncedDate: new Date(),
        partStatus: "Part-II", // Part-II exam
        portalCategory: categories[i],
        department: dept._id,
        program: progSE._id
      });
      await seExam.save();
      seExamsPartII.push(seExam);

      const aiExam = new CreateExam({
        Term: term._id,
        ExamType: examTypesPartII[i]._id,
        ExamWeightage: weightages[i],
        AnnouncedDate: new Date(),
        partStatus: "Part-II", // Part-II exam
        portalCategory: categories[i],
        department: dept._id,
        program: progAI._id
      });
      await aiExam.save();
      aiExamsPartII.push(aiExam);
    }
    console.log("Part-II Exams successfully created in system (Proposal-II, Mid-II, Final-II, Attendance-II).");

    // 10. VERIFY GRADING VIEWS FOR SUPERVISOR AND EXAMINERS IN PART II
    console.log("\n--- VERIFYING ELIGIBLE GROUPS AND STUDENTS FOR PART-II GRADING ---");

    // We will query the assigned exams list for our supervisor
    let supResStatus = null;
    let supResData = null;
    const mockSupRes = {
      status(code) {
        supResStatus = code;
        return this;
      },
      json(data) {
        supResData = data;
        return this;
      }
    };
    const mockSupReq = {
      params: {
        userId: supervisor._id.toString()
      }
    };

    await getFypRegistrationsByPanelMember(mockSupReq, mockSupRes);
    
    console.log(`Supervisor assigned projects fetched: Status = ${supResStatus}`);
    const supervisorGroups = supResData.asSupervisor || [];

    console.log(`\nFound ${supervisorGroups.length} total groups registered under Supervisor ${supervisor.name}:`);

    for (const group of supervisorGroups) {
      console.log(`\nGroup: "${group.topicData.topic}"`);
      console.log(`- Current Group partStatus: "${group.partStatus}"`);
      console.log(`- groupMembers Count in DB: ${group.groupMembers.length}`);
      
      if (group.partStatus === "failed-part-I") {
        console.log(`- VERIFIED: Group is failed. No members are present, meaning NO students can be evaluated for Part-II.`);
      } else if (group.partStatus === "part-II") {
        console.log(`- Group is promoted. Members available for Part-II evaluation:`);
        group.groupMembers.forEach(m => {
          console.log(`  * Student: ${m.name} (${m.registrationNumber}), User Collection partStatus: "${m.partStatus}"`);
        });
        
        // Assert that none of the members are in failed state
        const hasFailedMembers = group.groupMembers.some(m => m.partStatus === "failed-part-I");
        console.log(`  * VERIFIED: Contains failed members? ${hasFailedMembers ? "YES (Error)" : "NO (Correct)"}`);
      }
    }

    // 11. CLEAN UP ALL SEEDED RECORDS
    console.log("\n--- CLEANING UP SIMULATION DATA ---");
    await GenUser.deleteMany({ _id: { $in: [
      supervisor._id,
      ...panelFaculty.map(f => f._id),
      ...seStudents.map(s => s._id),
      ...aiStudents.map(s => s._id)
    ] } });

    await PanelDetails.deleteMany({ _id: { $in: [panel1._id, panel2._id] } });
    await FypRegistration.deleteMany({ _id: { $in: groups.map(g => g._id) } });
    await FYPTerm.deleteMany({ _id: term._id });
    await PassFailCriteria.deleteMany({ _id: criteria._id });
    await CreateExam.deleteMany({ _id: { $in: [
      ...seExams.map(e => e._id), 
      ...aiExams.map(e => e._id),
      ...seExamsPartII.map(e => e._id),
      ...aiExamsPartII.map(e => e._id)
    ] } });
    await StudentReport.deleteMany({ FYPGroup: { $in: groups.map(g => g._id) } });
    await Evaluation.deleteMany({ _id: evaluationDoc._id });

    console.log("Cleanup completed successfully. Database is back to baseline state.");
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");

  } catch (error) {
    console.error("Test scenario failed with error:", error);
    await mongoose.disconnect();
  }
}

run();
