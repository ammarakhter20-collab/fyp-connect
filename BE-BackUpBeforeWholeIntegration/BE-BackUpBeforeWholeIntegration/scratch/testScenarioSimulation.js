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

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("=============================================================");
    console.log("CONNECTED TO DATABASE successfully. Starting Simulation...");
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
    const termSession = "SIM-TERM-2026";
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
      name: "Sim Supervisor",
      email: "sim_supervisor@example.com",
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
        email: `fac_member_${i}@example.com`,
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
      panelCode: "PANEL-SIM-01",
      panelName: "Simulation Panel One",
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
      panelCode: "PANEL-SIM-02",
      panelName: "Simulation Panel Two",
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
        email: `se_student_${i}@example.com`,
        password: "password123",
        role: "Student",
        department: dept._id,
        program: progSE._id,
        term: term._id,
        registrationNumber: `REG-SE-00${i}`,
        partStatus: "part-I"
      });
      await student.save();
      seStudents.push(student);
    }

    for (let i = 1; i <= 9; i++) {
      const student = new GenUser({
        name: `AI Student ${i}`,
        email: `ai_student_${i}@example.com`,
        password: "password123",
        role: "Student",
        department: dept._id,
        program: progAI._id,
        term: term._id,
        registrationNumber: `REG-AI-00${i}`,
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

    console.log("6 groups seeded successfully:");
    console.log("- 3 Software Engineering (SE) groups assigned to Panels 1 (SE-1, SE-2) and 2 (SE-3)");
    console.log("- 3 Artificial Intelligence (AI) groups assigned to Panels 1 (AI-2) and 2 (AI-1, AI-3)");

    // 7. SEED EXAMS (Proposal, Mid-I, Final-I, Attendance-I)
    // Create Exam Types
    const examTypes = [];
    const examNames = ["Proposal", "Mid-I", "Final-I", "Attendance-I"];
    const weightages = [20, 20, 40, 20];
    const categories = ["Midterm", "Midterm", "Final", "Attendance"];

    for (let i = 0; i < 4; i++) {
      const name = examNames[i];
      let et = await ExamType.findOne({ shortCode: `SIM-ET-${name}` });
      if (!et) {
        et = new ExamType({
          examName: name,
          shortCode: `SIM-ET-${name}`,
          examTypeFor: name === "Attendance-I" ? "Supervisor" : "All",
          portalCategory: categories[i],
          defaultPart: "Part-I"
        });
        await et.save();
      }
      examTypes.push(et);
    }

    // Create Exams for AI and SE (8 CreatedExam documents total)
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

    console.log("\nExams created for both Programs (Proposal: 20%, Mid-I: 20%, Final-I: 40%, Attendance-I: 20%).");

    // 8. VERIFY REPORT TRIGGERING BEHAVIOR
    console.log("\n--- VERIFYING EXAM REPORT TRIGGERING (STUDENTREPORTS) ---");
    // Simulate student submitting report PDFs for exams
    const mockPdfPath = "uploads/mock_report.pdf";

    for (const grp of groups) {
      const isSE = grp.groupMembers[0].program.toString() === progSE._id.toString();
      const programExams = isSE ? seExams : aiExams;

      for (let i = 0; i < 4; i++) {
        const examName = examNames[i];
        const examObj = programExams[i];

        if (examName !== "Attendance-I") {
          // Triggering mock report for Proposal, Mid-I, and Final-I
          const report = new StudentReport({
            submitReportPdf: mockPdfPath,
            uploadedBy: grp.groupMembers[0]._id,
            FYPGroup: grp._id,
            Exam: examObj._id,
            status: "approved"
          });
          await report.save();
          console.log(`[TRIGGERED] Report successfully uploaded for ${grp.topicData.topic} - Exam: ${examName}`);
        } else {
          console.log(`[SKIPPED] Attendance-I does NOT trigger a report upload for ${grp.topicData.topic}`);
        }
      }
    }

    // 9. SIMULATE EVALUATION MARKS
    // Helper to build exam schema entries inside Evaluation model
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

    // We define marks (out of each exam's weightage) for each student
    // SE Students (seStudents)
    // seStudents[0] (fails overall): obtained average marks: 10 per exam (total 40)
    // seStudents[1, 2] (pass): 18 per exam (total 72)
    // seStudents[3, 4, 5] (pass): 18 per exam (total 72)
    // seStudents[6, 7, 8] (fail overall): 10 per exam (total 40)

    // AI Students (aiStudents)
    // aiStudents[0] (fails overall): 10 per exam (total 40)
    // aiStudents[1, 2] (pass): 18 per exam (total 72)
    // aiStudents[3, 4, 5] (pass): 18 per exam (total 72)
    // aiStudents[6, 7, 8] (fail overall): 10 per exam (total 40)

    const examsEvaluationData = [];

    for (let i = 0; i < 4; i++) {
      const examName = examNames[i];
      const examSE = seExams[i];
      const examAI = aiExams[i];

      const seGroupEvals = [
        buildGroupEval(groupSE1._id, panel1._id, [
          buildStudentEval(seStudents[0]._id, 10),
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
          buildStudentEval(aiStudents[0]._id, 10),
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
      terms: [{
        termId: term._id,
        exams: examsEvaluationData
      }],
      uploadedBy: supervisor._id
    });
    await evaluationDoc.save();
    console.log("\nMarks evaluated and saved in database via mock Evaluation record.");

    // DEBUG EVALUATION POPULATION
    const debugDocs = await Evaluation.find({ "terms.termId": term._id })
      .populate({
        path: 'terms.exams.examId',
        select: 'ExamWeightage ExamType partStatus portalCategory',
        populate: { path: 'ExamType', select: 'examName examTypeFor' }
      });
    
    console.log(`[DEBUG] Number of evaluation documents in DB for term: ${debugDocs.length}`);
    debugDocs.forEach(doc => {
      const t = doc.terms.find(termEntry => termEntry.termId.toString() === term._id.toString());
      if (t && t.exams) {
        t.exams.forEach(exam => {
          const dbPartStatus = exam.examId?.partStatus;
          const examTypeFor = exam.examId?.ExamType?.examTypeFor;
          const examName = exam.examId?.ExamType?.examName || exam.examName;
          console.log(`  - Exam: "${examName}", examId populated: ${!!exam.examId}, dbPartStatus: "${dbPartStatus}", examTypeFor: "${examTypeFor}"`);
          if (exam.fypGroups) {
            console.log(`    - Groups count: ${exam.fypGroups.length}`);
            exam.fypGroups.forEach(g => {
              console.log(`      - Group: ${g.groupId}, Students count: ${g.students?.length}`);
            });
          }
        });
      }
    });

    // 10. RUN PROMOTION/CONTINUATION LOGIC
    console.log("\n--- EXECUTING PROMOTION / CONTINUATION PHASE ---");
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
    console.log(`Promotion Request finished with Status: ${responseStatus}`);
    console.log(`Promotion Response Message: ${responseData?.message || responseData?.error}`);

    // 11. INSPECT THE OUTCOMES IN DB
    console.log("\n--- VERIFYING THE SIMULATION OUTCOMES ---");
    
    // Check group SE-1: 1 fail (SE Student 1), 2 pass (SE Student 2 & 3)
    const finalSE1 = await FypRegistration.findById(groupSE1._id);
    const uStudentSE1_0 = await GenUser.findById(seStudents[0]._id);
    const uStudentSE1_1 = await GenUser.findById(seStudents[1]._id);
    const uStudentSE1_2 = await GenUser.findById(seStudents[2]._id);
    console.log("\nSE Group 1 (Partial Pass):");
    console.log(`- Group partStatus: "${finalSE1.partStatus}" (Expected: "part-II")`);
    console.log(`- Remaining members count: ${finalSE1.groupMembers.length} (Expected: 2)`);
    console.log(`- SE Student 1 (failed) status in user collection: "${uStudentSE1_0.partStatus}" (Expected: "failed-part-I")`);
    console.log(`- SE Student 1 term in user collection: ${uStudentSE1_0.term} (Expected: null)`);
    console.log(`- SE Student 2 (passed) status: "${uStudentSE1_1.partStatus}" (Expected: "part-II")`);
    console.log(`- SE Student 3 (passed) status: "${uStudentSE1_2.partStatus}" (Expected: "part-II")`);

    // Check group SE-2: All cleared
    const finalSE2 = await FypRegistration.findById(groupSE2._id);
    console.log("\nSE Group 2 (All Passed):");
    console.log(`- Group partStatus: "${finalSE2.partStatus}" (Expected: "part-II")`);
    console.log(`- Remaining members count: ${finalSE2.groupMembers.length} (Expected: 3)`);

    // Check group SE-3: All failed
    const finalSE3 = await FypRegistration.findById(groupSE3._id);
    const uStudentSE3_0 = await GenUser.findById(seStudents[6]._id);
    console.log("\nSE Group 3 (All Failed):");
    console.log(`- Group partStatus: "${finalSE3.partStatus}" (Expected: "failed-part-I")`);
    console.log(`- Remaining members count: ${finalSE3.groupMembers.length} (Expected: 0)`);
    console.log(`- SE Student 7 status: "${uStudentSE3_0.partStatus}" (Expected: "failed-part-I")`);

    // Check group AI-1: 1 fail (AI Student 1), 2 pass (AI Student 2 & 3)
    const finalAI1 = await FypRegistration.findById(groupAI1._id);
    const uStudentAI1_0 = await GenUser.findById(aiStudents[0]._id);
    const uStudentAI1_1 = await GenUser.findById(aiStudents[1]._id);
    console.log("\nAI Group 1 (Partial Pass):");
    console.log(`- Group partStatus: "${finalAI1.partStatus}" (Expected: "part-II")`);
    console.log(`- Remaining members count: ${finalAI1.groupMembers.length} (Expected: 2)`);
    console.log(`- AI Student 1 (failed) status: "${uStudentAI1_0.partStatus}" (Expected: "failed-part-I")`);
    console.log(`- AI Student 2 (passed) status: "${uStudentAI1_1.partStatus}" (Expected: "part-II")`);

    // Check group AI-2: All cleared
    const finalAI2 = await FypRegistration.findById(groupAI2._id);
    console.log("\nAI Group 2 (All Passed):");
    console.log(`- Group partStatus: "${finalAI2.partStatus}" (Expected: "part-II")`);
    console.log(`- Remaining members count: ${finalAI2.groupMembers.length} (Expected: 3)`);

    // Check group AI-3: All failed
    const finalAI3 = await FypRegistration.findById(groupAI3._id);
    const uStudentAI3_0 = await GenUser.findById(aiStudents[6]._id);
    console.log("\nAI Group 3 (All Failed):");
    console.log(`- Group partStatus: "${finalAI3.partStatus}" (Expected: "failed-part-I")`);
    console.log(`- Remaining members count: ${finalAI3.groupMembers.length} (Expected: 0)`);
    console.log(`- AI Student 7 status: "${uStudentAI3_0.partStatus}" (Expected: "failed-part-I")`);

    // 12. CLEAN UP ALL SEEDED RECORDS
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
    await CreateExam.deleteMany({ _id: { $in: [...seExams.map(e => e._id), ...aiExams.map(e => e._id)] } });
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
