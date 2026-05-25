const mongoose = require("mongoose");
const CreateExam = require("../server/models/CoordinatorModels/ExamCreationModel");
const CreateExamSchedule = require("../server/models/CoordinatorModels/ExamScheduleModel");
const Evaluation = require("../server/models/CoordinatorModels/EvaluateExamModel");
const Result = require("../server/models/CoordinatorModels/ResultsModel");

const run = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("Connected to MongoDB successfully.");

    // Fetch existing records to satisfy validations
    const db = mongoose.connection.db;
    const term = await db.collection("fypterms").findOne({});
    const examType = await db.collection("examtypes").findOne({});
    const dept = await db.collection("departments").findOne({});
    const prog = await db.collection("programs").findOne({});

    if (!term || !examType || !dept || !prog) {
      console.error("Missing baseline database records (term, examType, department, or program) to create dummy exam.");
      return;
    }

    console.log("Baseline IDs:");
    console.log("Term ID:", term._id);
    console.log("ExamType ID:", examType._id);
    console.log("Department ID:", dept._id);
    console.log("Program ID:", prog._id);

    // 1. Create a dummy Exam Creation record
    const dummyExam = new CreateExam({
      Term: term._id,
      ExamType: examType._id,
      ExamWeightage: 20,
      AnnouncedDate: new Date(),
      ReportDeadline: new Date(),
      partStatus: "Part-I",
      portalCategory: "Midterm",
      status: "Active",
      department: dept._id,
      program: prog._id
    });
    await dummyExam.save();
    const examId = dummyExam._id;
    console.log("\nCreated dummy exam with ID:", examId);

    // 2. Create a dummy Exam Schedule
    // We need a dummy panel ID. Let's check paneldetails or use a random one.
    const panelId = new mongoose.Types.ObjectId();
    const dummySchedule = new CreateExamSchedule({
      panel: panelId,
      ExamDate: new Date(),
      ExamTime: "10:00 AM",
      Venue: "Lab 3",
      CreatedExam: examId
    });
    await dummySchedule.save();
    console.log("Created dummy exam schedule with ID:", dummySchedule._id);

    // 3. Create a dummy Evaluation
    const supervisorId = new mongoose.Types.ObjectId();
    const dummyEvaluation = new Evaluation({
      supervisorId: supervisorId,
      terms: [
        {
          termId: term._id,
          exams: [
            {
              examId: examId,
              examTypeFor: "Part-I",
              examName: "Dummy Midterm",
              fypGroups: []
            }
          ]
        }
      ]
    });
    await dummyEvaluation.save();
    console.log("Created dummy evaluation with ID:", dummyEvaluation._id);

    // 4. Create a dummy Result
    const dummyResult = new Result({
      terms: [
        {
          termId: term._id,
          students: [
            {
              studentId: new mongoose.Types.ObjectId(),
              part_1: [
                {
                  examId: examId,
                  marks: 85,
                  resultStatus: "P"
                }
              ]
            }
          ]
        }
      ]
    });
    await dummyResult.save();
    console.log("Created dummy student result with ID:", dummyResult._id);

    // Verify they exist in the DB
    console.log("\n--- Verification Before Deletion ---");
    const examBefore = await CreateExam.findById(examId);
    const scheduleBefore = await CreateExamSchedule.findOne({ CreatedExam: examId });
    const evaluationBefore = await Evaluation.findOne({ "terms.exams.examId": examId });
    const resultBefore = await Result.findOne({ "terms.students.part_1.examId": examId });

    console.log("Exam exists:", !!examBefore);
    console.log("Schedule exists:", !!scheduleBefore);
    console.log("Evaluation contains exam:", !!evaluationBefore);
    console.log("Result contains exam:", !!resultBefore);

    // 5. Run the deletion logic
    console.log("\nRunning cascading deletion...");
    const examIds = [examId, new mongoose.Types.ObjectId(examId)];

    // Step A: Delete schedules
    const deletedSchedules = await CreateExamSchedule.deleteMany({ CreatedExam: { $in: examIds } });
    console.log(`Deleted schedules: ${deletedSchedules.deletedCount}`);

    // Step B: Pull exams from evaluations
    const updatedEvaluations = await Evaluation.updateMany(
      { "terms.exams.examId": { $in: examIds } },
      { $pull: { "terms.$[].exams": { examId: { $in: examIds } } } }
    );
    console.log(`Updated evaluations matched: ${updatedEvaluations.matchedCount}, modified: ${updatedEvaluations.modifiedCount}`);

    // Step C: Pull exam from results
    const updatedResults = await Result.updateMany(
      {
        $or: [
          { "terms.students.part_1.examId": { $in: examIds } },
          { "terms.students.part_2.examId": { $in: examIds } }
        ]
      },
      {
        $pull: {
          "terms.$[].students.$[].part_1": { examId: { $in: examIds } },
          "terms.$[].students.$[].part_2": { examId: { $in: examIds } }
        }
      }
    );
    console.log(`Updated results matched: ${updatedResults.matchedCount}, modified: ${updatedResults.modifiedCount}`);

    // Step D: Delete exam itself
    const deletedExamObj = await CreateExam.findByIdAndDelete(examId);
    console.log("Deleted exam document from DB:", !!deletedExamObj);

    // Verify they are deleted
    console.log("\n--- Verification After Deletion ---");
    const examAfter = await CreateExam.findById(examId);
    const scheduleAfter = await CreateExamSchedule.findOne({ CreatedExam: examId });
    const evaluationAfter = await Evaluation.findOne({ "terms.exams.examId": examId });
    const resultAfter = await Result.findOne({ "terms.students.part_1.examId": examId });

    console.log("Exam exists:", !!examAfter);
    console.log("Schedule exists:", !!scheduleAfter);
    console.log("Evaluation contains exam:", !!evaluationAfter);
    console.log("Result contains exam:", !!resultAfter);

    // Cleanup mock evaluation and results containers entirely if needed
    await Evaluation.findByIdAndDelete(dummyEvaluation._id);
    await Result.findByIdAndDelete(dummyResult._id);
    console.log("\nCleaned up dummy evaluation & result containers successfully.");

  } catch (err) {
    console.error("Error in script:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

run();
