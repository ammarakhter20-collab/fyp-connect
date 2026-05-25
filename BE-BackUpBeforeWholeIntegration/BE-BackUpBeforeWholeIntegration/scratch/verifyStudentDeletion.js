const mongoose = require("mongoose");
const GenUser = require("../server/models/AdminModels/GenUserModel");
const FypRegistration = require("../server/models/StudentModels/fypRegModel");
const FYPGroupAttendance = require("../server/models/SupervisorModels/FYPAttendanceModel");
const ExamMarks = require("../server/models/SupervisorModels/examMarksAssignment");
const TaskAssignment = require("../server/models/SupervisorModels/TaskAssigmentModel");
const StudentReport = require("../server/models/CoordinatorModels/StudentReportsModel");
const FYPTopicChangeRequest = require("../server/models/StudentModels/TopicReqModel");
const FYPTechnologyChangeRequest = require("../server/models/StudentModels/TechReqModel");
const FypChangeRequest = require("../server/models/SupervisorModels/changeRequest");
const Feedback = require("../server/models/SupervisorModels/FeedbackModel");
const Evaluation = require("../server/models/CoordinatorModels/EvaluateExamModel");
const Result = require("../server/models/CoordinatorModels/ResultsModel");
const Timetable = require("../server/models/StudentModels/StdTimetableModel");
const ExamAssignment = require("../server/models/CoordinatorModels/ExamAssignment");

const { deleteStudent } = require("../server/controllers/AdminCont/GenUserController");

const run = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("Connected to MongoDB successfully.");

    // Fetch baseline ids
    const db = mongoose.connection.db;
    const term = await db.collection("fypterms").findOne({});
    const dept = await db.collection("departments").findOne({});
    const prog = await db.collection("programs").findOne({});
    const examType = await db.collection("examtypes").findOne({});
    const createExam = await db.collection("createexammodels").findOne({});
    const createExamId = createExam ? createExam._id : new mongoose.Types.ObjectId();

    if (!term || !dept || !prog || !examType) {
      console.error("Missing baseline DB records (term, department, program, or examType). Make sure backend runs database seeds.");
      return;
    }

    // 1. Create two mock students
    const studentA = new GenUser({
      name: "Student A Mock",
      email: "studenta@mock.com",
      role: "Student",
      department: dept._id,
      program: prog._id,
      term: term._id,
      password: "password123",
      registrationNumber: "MOCK-REG-001"
    });
    await studentA.save();

    const studentB = new GenUser({
      name: "Student B Mock",
      email: "studentb@mock.com",
      role: "Student",
      department: dept._id,
      program: prog._id,
      term: term._id,
      password: "password123",
      registrationNumber: "MOCK-REG-002"
    });
    await studentB.save();

    console.log(`Created mock students:\nStudent A: ${studentA._id}\nStudent B: ${studentB._id}`);

    // 2. Create FypRegistration group with A & B
    const group = new FypRegistration({
      groupMembers: [
        {
          _id: studentA._id,
          name: studentA.name,
          email: studentA.email
        },
        {
          _id: studentB._id,
          name: studentB.name,
          email: studentB.email
        }
      ],
      selectedOption: studentA._id, // supervisor id mock or student id
      selectedTechnology: new mongoose.Types.ObjectId(),
      topicData: { title: "Mock Topic" },
      selectedPlatform: new mongoose.Types.ObjectId(),
      reqStatus: "approved",
      user: studentA._id,
      term: term._id
    });
    await group.save();
    console.log(`Created group with ID: ${group._id}`);

    // 3. Create student-associated mock records
    // Timetable
    const timetable = new Timetable({
      Monday: [{ slot: "8:30-10:00", class: "CS-101" }],
      user: studentA._id
    });
    await timetable.save();

    // StudentReport
    const report = new StudentReport({
      submitReportPdf: "report.pdf",
      uploadedBy: studentA._id,
      FYPGroup: group._id,
      Exam: examType._id
    });
    await report.save();

    // Topic Request
    const topicReq = new FYPTopicChangeRequest({
      user: studentA._id,
      groupId: group._id,
      fypTopic: "Old Title",
      newFypTopic: "New Title",
      reasonForChange: "Better scope"
    });
    await topicReq.save();

    // Tech Request
    const techReq = new FYPTechnologyChangeRequest({
      user: studentA._id,
      groupId: group._id,
      fypTechnology: "Old Tech",
      newFypTechnology: "New Tech",
      reasonForChange: "Better stack"
    });
    await techReq.save();

    // Supervisor Request
    const supReq = new FypChangeRequest({
      fypGroup: group._id,
      changeData: { topic: "New topic" },
      requestedBy: studentA._id
    });
    await supReq.save();

    // Task Assignment submission by Student A
    const task = new TaskAssignment({
      groupId: group._id,
      SubmittedBy: studentA._id,
      taskTitle: "Mock Task",
      taskNo: 1,
      points: 10,
      dueDate: new Date(),
      dueTime: "11:59 PM",
      status: "submitted",
      submitPdf: "sub.pdf"
    });
    await task.save();

    // Attendance
    const attendance = new FYPGroupAttendance({
      fypgroup: group._id,
      partStatus: [
        {
          part: "part-I",
          meetings: [
            {
              meetingNo: 1,
              meetingDate: new Date(),
              meetingStartTime: new Date(),
              meetingEndTime: new Date(),
              memberAttendances: [
                { member: studentA._id, status: "present" },
                { member: studentB._id, status: "absent" }
              ]
            }
          ]
        }
      ]
    });
    await attendance.save();

    // ExamMarks
    const examMarks = new ExamMarks({
      exam: new mongoose.Types.ObjectId(),
      examiners: [
        {
          examiner: new mongoose.Types.ObjectId(),
          marks: [
            { student: studentA._id, obtainedMarks: 18, totalMarks: 20 },
            { student: studentB._id, obtainedMarks: 15, totalMarks: 20 }
          ]
        }
      ],
      groupId: group._id
    });
    await examMarks.save();

    // Feedback
    const feedback = new Feedback({
      feedback: "Good work",
      groupId: group._id
    });
    await feedback.save();

    // ExamAssignment submitted by Student A
    const examAssignment = new ExamAssignment({
      groupId: group._id,
      termId: term._id,
      departmentId: dept._id,
      penal: new mongoose.Types.ObjectId(),
      submitBy: studentA._id,
      examTitle: "Midterm Assignment",
      partStatus: "part-I",
      points: 50,
      dueDate: "2026-06-01",
      dueTime: "11:59 PM",
      reportStatus: "submitted",
      submitPdf: "exam.pdf"
    });
    await examAssignment.save();

    // Evaluation
    const evaluation = new Evaluation({
      supervisorId: new mongoose.Types.ObjectId(),
      terms: [
        {
          termId: term._id,
          exams: [
            {
              examId: createExamId,
              examTypeFor: "part-I",
              examName: "Midterm Exam",
              fypGroups: [
                {
                  groupId: group._id,
                  students: [
                    { studentId: studentA._id, marks: 45, obtainedAverage: 45 },
                    { studentId: studentB._id, marks: 40, obtainedAverage: 40 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
    await evaluation.save();

    // Result
    const result = new Result({
      terms: [
        {
          termId: term._id,
          students: [
            { studentId: studentA._id, part_1: [] },
            { studentId: studentB._id, part_1: [] }
          ]
        }
      ]
    });
    await result.save();

    console.log("Mock records successfully generated.");

    // --- VERIFY BEFORE DELETION OF STUDENT A ---
    console.log("\n--- Verification Before Student A Deletion ---");
    const groupBefore = await FypRegistration.findById(group._id);
    console.log("Group contains student A:", groupBefore.groupMembers.some(m => m._id.toString() === studentA._id.toString()));
    console.log("Group member count:", groupBefore.groupMembers.length);

    const timetableBefore = await Timetable.findOne({ user: studentA._id });
    console.log("Timetable exists:", !!timetableBefore);

    const reportBefore = await StudentReport.findOne({ uploadedBy: studentA._id });
    console.log("Report exists:", !!reportBefore);

    const topicReqBefore = await FYPTopicChangeRequest.findOne({ user: studentA._id });
    console.log("Topic request exists:", !!topicReqBefore);

    const techReqBefore = await FYPTechnologyChangeRequest.findOne({ user: studentA._id });
    console.log("Tech request exists:", !!techReqBefore);

    const supReqBefore = await FypChangeRequest.findOne({ requestedBy: studentA._id });
    console.log("Sup request exists:", !!supReqBefore);

    const taskBefore = await TaskAssignment.findOne({ SubmittedBy: studentA._id });
    console.log("Task submitted by student A exists:", !!taskBefore);

    const attBefore = await FYPGroupAttendance.findOne({ "partStatus.meetings.memberAttendances.member": studentA._id });
    console.log("Attendance has student A:", !!attBefore);

    const examMarksBefore = await ExamMarks.findOne({ "examiners.marks.student": studentA._id });
    console.log("Exam marks have student A:", !!examMarksBefore);

    const feedbackBefore = await Feedback.findOne({ groupId: group._id });
    console.log("Feedback exists:", !!feedbackBefore);

    const examAssignmentBefore = await ExamAssignment.findOne({ submitBy: studentA._id });
    console.log("Exam assignment submitBy is Student A:", !!examAssignmentBefore);

    const evaluationBefore = await Evaluation.findOne({ "terms.exams.fypGroups.students.studentId": studentA._id });
    console.log("Evaluation contains student A:", !!evaluationBefore);

    const resultBefore = await Result.findOne({ "terms.students.studentId": studentA._id });
    console.log("Result contains student A:", !!resultBefore);

    // Call deleteStudent controller for Student A
    console.log("\n[ACTION] Calling deleteStudent for Student A...");
    const req = { body: { studentId: studentA._id.toString() } };
    const res = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.jsonData = data;
        return this;
      }
    };
    await deleteStudent(req, res);
    console.log(`Controller responded with status ${res.statusCode}:`, res.jsonData);

    // --- VERIFY AFTER DELETION OF STUDENT A ---
    console.log("\n--- Verification After Student A Deletion ---");
    const studentABox = await GenUser.findById(studentA._id);
    console.log("Student A user document exists (expected false):", !!studentABox);

    const groupAfterA = await FypRegistration.findById(group._id);
    console.log("Group exists (expected true):", !!groupAfterA);
    if (groupAfterA) {
      console.log("Group contains student A (expected false):", groupAfterA.groupMembers.some(m => m._id.toString() === studentA._id.toString()));
      console.log("Group contains student B (expected true):", groupAfterA.groupMembers.some(m => m._id.toString() === studentB._id.toString()));
      console.log("Group member count (expected 1):", groupAfterA.groupMembers.length);
    }

    const timetableAfter = await Timetable.findOne({ user: studentA._id });
    console.log("Timetable exists (expected false):", !!timetableAfter);

    const reportAfter = await StudentReport.findOne({ uploadedBy: studentA._id });
    console.log("Report exists (expected false):", !!reportAfter);

    const topicReqAfter = await FYPTopicChangeRequest.findOne({ user: studentA._id });
    console.log("Topic request exists (expected false):", !!topicReqAfter);

    const techReqAfter = await FYPTechnologyChangeRequest.findOne({ user: studentA._id });
    console.log("Tech request exists (expected false):", !!techReqAfter);

    const supReqAfter = await FypChangeRequest.findOne({ requestedBy: studentA._id });
    console.log("Sup request exists (expected false):", !!supReqAfter);

    const taskAfter = await TaskAssignment.findOne({ SubmittedBy: studentA._id });
    console.log("Task SubmittedBy student A exists (expected false):", !!taskAfter);
    if (taskAfter === null) {
      const taskReset = await TaskAssignment.findOne({ groupId: group._id });
      console.log("Task reset (status: pending, submitPdf: empty):", taskReset && taskReset.status === "pending" && taskReset.submitPdf === "");
    }

    const attAfter = await FYPGroupAttendance.findOne({ "partStatus.meetings.memberAttendances.member": studentA._id });
    console.log("Attendance has student A (expected false):", !!attAfter);

    const examMarksAfter = await ExamMarks.findOne({ "examiners.marks.student": studentA._id });
    console.log("Exam marks have student A (expected false):", !!examMarksAfter);

    const examAssignmentAfter = await ExamAssignment.findOne({ groupId: group._id });
    if (examAssignmentAfter) {
      console.log("Exam assignment submitBy reassigned to student B (expected true):", examAssignmentAfter.submitBy.toString() === studentB._id.toString());
    }

    const evaluationAfter = await Evaluation.findOne({ "terms.exams.fypGroups.students.studentId": studentA._id });
    console.log("Evaluation contains student A (expected false):", !!evaluationAfter);

    const resultAfter = await Result.findOne({ "terms.students.studentId": studentA._id });
    console.log("Result contains student A (expected false):", !!resultAfter);


    // --- ACTION: DELETE STUDENT B (GROUP BECOMES EMPTY) ---
    console.log("\n[ACTION] Calling deleteStudent for Student B (should cascadingly delete group)...");
    const reqB = { body: { studentId: studentB._id.toString() } };
    const resB = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.jsonData = data;
        return this;
      }
    };
    await deleteStudent(reqB, resB);
    console.log(`Controller responded with status ${resB.statusCode}:`, resB.jsonData);

    // --- VERIFY AFTER DELETION OF STUDENT B (GROUP DELETED) ---
    console.log("\n--- Verification After Student B Deletion (Empty Group Deletion) ---");
    const studentBBox = await GenUser.findById(studentB._id);
    console.log("Student B user document exists (expected false):", !!studentBBox);

    const groupAfterB = await FypRegistration.findById(group._id);
    console.log("Group exists (expected false):", !!groupAfterB);

    const attAfterB = await FYPGroupAttendance.findOne({ fypgroup: group._id });
    console.log("Group Attendance exists (expected false):", !!attAfterB);

    const examMarksAfterB = await ExamMarks.findOne({ groupId: group._id });
    console.log("Exam marks exist (expected false):", !!examMarksAfterB);

    const taskAfterB = await TaskAssignment.findOne({ groupId: group._id });
    console.log("Task assignment exists (expected false):", !!taskAfterB);

    const feedbackAfterB = await Feedback.findOne({ groupId: group._id });
    console.log("Feedback exists (expected false):", !!feedbackAfterB);

    const examAssignmentAfterB = await ExamAssignment.findOne({ groupId: group._id });
    console.log("Exam assignment exists (expected false):", !!examAssignmentAfterB);

    const evaluationAfterB = await Evaluation.findOne({ "terms.exams.fypGroups.groupId": group._id });
    console.log("Evaluation contains group (expected false):", !!evaluationAfterB);

    // Cleanup mock evaluation and results containers entirely
    await Evaluation.findByIdAndDelete(evaluation._id);
    await Result.findByIdAndDelete(result._id);
    console.log("\nCleaned up containers successfully.");

  } catch (err) {
    console.error("Error in verification script:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

run();
