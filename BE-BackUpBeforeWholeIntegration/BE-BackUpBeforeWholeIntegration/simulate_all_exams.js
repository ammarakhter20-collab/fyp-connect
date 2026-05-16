require('dotenv').config();
const mongoose = require('mongoose');
const FypRegistration = require('./server/models/StudentModels/fypRegModel');
const ExamType = require('./server/models/CoordinatorModels/ExamTypeModel');
const ManageCLO = require('./server/models/CoordinatorModels/CLOsModel');
const QuestionsForCLO = require('./server/models/CoordinatorModels/QuesForCLOModel');
const CLOForExam = require('./server/models/CoordinatorModels/CLOForExamModel');
const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');
const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function runSimulation() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/MIS');
    console.log("Connected to MongoDB.");

    const group = await FypRegistration.findOne({ reqStatus: "approved" })
      .populate('term')
      .populate('selectedOption')
      .populate('groupMembers');

    if (!group) {
      console.log("No approved FYP Registration found.");
      process.exit(1);
    }
    
    const termId = group.term._id;
    const supervisorId = group.selectedOption._id;
    const programId = group.groupMembers[0].program; 

    // Helper function to create Exam Types, CLOs, Assignments, and Evaluations
    async function createAndEvaluateExam(name, shortCode, category, weightage) {
      console.log(`\n--- Processing ${name} ---`);
      
      // 1. Exam Type
      let examType = await ExamType.findOne({ shortCode: shortCode });
      if (!examType) {
        examType = await ExamType.create({
          examName: name,
          shortCode: shortCode,
          examTypeFor: "Supervisor",
          portalCategory: category,
          defaultPart: "Part-I"
        });
      }

      // 2. Question & CLO
      let question = await QuestionsForCLO.findOne({ shortCode: `Q-${shortCode}` });
      if (!question) {
        question = await QuestionsForCLO.create({
          shortCode: `Q-${shortCode}`,
          question: `Evaluate student performance for ${name}`,
          marks: 100
        });
      }
      
      let clo = await ManageCLO.findOne({ CLOCode: `CLO-${shortCode}` });
      if (!clo) {
        clo = await ManageCLO.create({
          CLOCode: `CLO-${shortCode}`,
          Title: `${name} Outcomes`,
          Program: programId,
          Questions: [question._id]
        });
      }

      // 3. CLO Mapping
      let cloMapping = await CLOForExam.findOne({ shortCode: `MAP-${shortCode}` });
      if (!cloMapping) {
        cloMapping = await CLOForExam.create({
          shortCode: `MAP-${shortCode}`,
          program: programId,
          CLOs: [clo._id]
        });
      }

      // 4. Exam Assignment
      let exam = await CreateExam.findOne({ ExamType: examType._id, Term: termId });
      if (!exam) {
        exam = await CreateExam.create({
          Term: termId,
          ExamType: examType._id,
          ExamWeightage: weightage,
          AnnouncedDate: new Date(),
          CLOForExams: cloMapping._id,
          partStatus: "Part-I",
          portalCategory: category,
          status: "Active"
        });
        console.log(`Assigned Exam ${name} with weight ${weightage}%`);
      }

      // 5. Evaluate Students
      let evaluation = await Evaluation.findOne({ supervisorId: supervisorId });
      if (!evaluation) {
        evaluation = new Evaluation({ supervisorId: supervisorId, terms: [] });
      }

      let termSchema = evaluation.terms.find(t => t.termId.toString() === termId.toString());
      if (!termSchema) {
        evaluation.terms.push({ termId: termId, exams: [] });
        termSchema = evaluation.terms[evaluation.terms.length - 1];
      }

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

      let groupEval = examSchema.fypGroups.find(g => g.groupId.toString() === group._id.toString());
      if (!groupEval) {
        const studentsEvals = group.groupMembers.map(student => {
          // Assume student gets 90% in everything
          const marksObtained = (weightage * 0.9);
          return {
            studentId: student._id,
            marks: marksObtained,
            obtainedAverage: 90,
            obtainedAverageofCLO: [
              { cloId: clo._id, averageCLOPercentage: 90, totalCLOPercentage: 100 }
            ],
            evaluationsByExaminers: [{
              examinerId: supervisorId,
              marks: marksObtained,
              totalWeightage: weightage,
              feedback: `Excellent ${name}`,
              evaluations: [{
                cloForExamId: cloMapping._id,
                totalCLOPercentage: 100,
                obtainedCLOPercentage: 90,
                cloEvaluations: [{
                  cloId: clo._id,
                  totalPercentage: 100,
                  obtainedPercentage: 90,
                  questions: [{
                    questionId: question._id,
                    marks: 90
                  }]
                }]
              }]
            }]
          };
        });

        examSchema.fypGroups.push({
          groupId: group._id,
          approvedStatus: "approved",
          students: studentsEvals
        });

        await evaluation.save();
        console.log(`Evaluated Group for ${name}!`);
      } else {
        console.log(`Group already evaluated for ${name}`);
      }
    }

    // Generate Proposal (10%)
    await createAndEvaluateExam("Proposal Evaluation", "PROP1", "Other", 10);
    
    // Generate Attendance (10%)
    await createAndEvaluateExam("Attendance Check", "ATT1", "Attendance", 10);
    
    // Generate Final (60%)
    await createAndEvaluateExam("Final Evaluation", "FIN1", "Final", 60);

    console.log("\nAll remaining exams successfully created and graded!");
    process.exit(0);
  } catch (error) {
    console.error("Error during simulation:", error);
    process.exit(1);
  }
}

runSimulation();
