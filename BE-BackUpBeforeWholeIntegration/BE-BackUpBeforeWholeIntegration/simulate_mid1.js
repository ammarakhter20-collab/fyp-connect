const mongoose = require('mongoose');
const FypRegistration = require('./server/models/StudentModels/fypRegModel');
const ExamType = require('./server/models/CoordinatorModels/ExamTypeModel');
const ManageCLO = require('./server/models/CoordinatorModels/CLOsModel');
const QuestionsForCLO = require('./server/models/CoordinatorModels/QuesForCLOModel');
const CLOForExam = require('./server/models/CoordinatorModels/CLOForExamModel');
const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');
const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');
const FYPTerm = require('./server/models/AdminModels/fypTerm');
const GenUser = require('./server/models/AdminModels/GenUserModel');

require('dotenv').config();

async function runSimulation() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/MIS');
    console.log("Connected to MongoDB.");

    // 1. Find an approved group
    const group = await FypRegistration.findOne({ reqStatus: "approved" })
      .populate('term')
      .populate('selectedOption')
      .populate('groupMembers');

    if (!group) {
      console.log("No approved FYP Registration found. Please approve a group first.");
      process.exit(1);
    }
    console.log(`Found Approved Group: ${group._id}`);
    
    const termId = group.term._id;
    const supervisorId = group.selectedOption._id;
    const programId = group.groupMembers[0].program; // Assume all members share a program
    
    // 2. Create Exam Type (Supervisor-based Mid 1)
    let examType = await ExamType.findOne({ shortCode: "MID1" });
    if (!examType) {
      examType = await ExamType.create({
        examName: "Midterm 1 Evaluation",
        shortCode: "MID1",
        examTypeFor: "Supervisor",
        portalCategory: "Midterm",
        defaultPart: "Part-I"
      });
      console.log("Created ExamType MID1");
    } else {
      console.log("ExamType MID1 already exists");
    }

    // 3. Create CLO and Questions
    let clo = await ManageCLO.findOne({ CLOCode: "CLO1" });
    let question1;
    if (!clo) {
      question1 = await QuestionsForCLO.create({
        shortCode: "Q1",
        question: "Demonstrate understanding of the project domain.",
        marks: 100
      });
      clo = await ManageCLO.create({
        CLOCode: "CLO1",
        Title: "Domain Knowledge",
        Program: programId,
        Questions: [question1._id]
      });
      console.log("Created ManageCLO and Question");
    } else {
      console.log("ManageCLO already exists");
      question1 = await QuestionsForCLO.findOne({ _id: clo.Questions[0] });
    }

    // 4. Create CLOForExam Mapping
    let cloMapping = await CLOForExam.findOne({ 
      shortCode: "CLO-MAP-1"
    });
    if (!cloMapping) {
      cloMapping = await CLOForExam.create({
        shortCode: "CLO-MAP-1",
        program: programId,
        CLOs: [clo._id]
      });
      console.log("Created CLOForExam Mapping");
    } else {
      console.log("CLOForExam Mapping already exists");
    }

    // 5. Create Exam Assignment
    let exam = await CreateExam.findOne({ ExamType: examType._id, Term: termId });
    if (!exam) {
      exam = await CreateExam.create({
        Term: termId,
        ExamType: examType._id,
        ExamWeightage: 20, // 20 marks total
        AnnouncedDate: new Date(),
        CLOForExams: cloMapping._id,
        partStatus: "Part-I",
        portalCategory: "Midterm",
        status: "Active"
      });
      console.log("Created Assigned Exam");
    } else {
      console.log("Exam already assigned for this term");
    }

    // 6. Evaluate the Students
    let evaluation = await Evaluation.findOne({ supervisorId: supervisorId });
    if (!evaluation) {
      evaluation = new Evaluation({ supervisorId: supervisorId, terms: [] });
    }

    // Find or create Term schema inside Evaluation
    let termSchema = evaluation.terms.find(t => t.termId.toString() === termId.toString());
    if (!termSchema) {
      evaluation.terms.push({ termId: termId, exams: [] });
      termSchema = evaluation.terms[evaluation.terms.length - 1];
    }

    // Find or create Exam schema inside Term
    let examSchema = termSchema.exams.find(e => e.examId.toString() === exam._id.toString());
    if (!examSchema) {
      termSchema.exams.push({
        examId: exam._id,
        examTypeFor: examType.examTypeFor,
        examName: examType.examName,
        fypGroups: []
      });
      examSchema = termSchema.exams[termSchema.exams.length - 1];
    }

    // Check if group is already evaluated
    let groupEval = examSchema.fypGroups.find(g => g.groupId.toString() === group._id.toString());
    if (groupEval) {
      console.log("Group already evaluated for this exam.");
    } else {
      // Evaluate students
      const studentsEvals = group.groupMembers.map(student => {
        return {
          studentId: student._id,
          marks: 18, // out of 20
          obtainedAverage: 90,
          obtainedAverageofCLO: [
            { cloId: clo._id, averageCLOPercentage: 90, totalCLOPercentage: 100 }
          ],
          evaluationsByExaminers: [{
            examinerId: supervisorId,
            marks: 18,
            totalWeightage: 20,
            feedback: "Good progress so far.",
            evaluations: [{
              cloForExamId: cloMapping._id,
              totalCLOPercentage: 100,
              obtainedCLOPercentage: 90,
              cloEvaluations: [{
                cloId: clo._id,
                totalPercentage: 100,
                obtainedPercentage: 90,
                questions: [{
                  questionId: question1._id,
                  marks: 90
                }]
              }]
            }]
          }]
        };
      });

      examSchema.fypGroups.push({
        groupId: group._id,
        approvedStatus: "approved", // So students can see it immediately
        students: studentsEvals
      });

      await evaluation.save();
      console.log(`Successfully Evaluated Group ${group._id} for Midterm 1!`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error during simulation:", error);
    process.exit(1);
  }
}

runSimulation();
