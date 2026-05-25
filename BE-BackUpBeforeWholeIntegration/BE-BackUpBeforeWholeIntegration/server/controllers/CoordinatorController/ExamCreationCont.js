const CreateExam = require("../../models/CoordinatorModels/ExamCreationModel");
const ScheduleController = require("../../controllers/CoordinatorController/ExamScheduleCont");
const GenUser = require("../../models/AdminModels/GenUserModel");
const FypRegistration = require("../../models/StudentModels/fypRegModel");
const mongoose = require("mongoose");

const CATEGORY_CAPACITIES = {
  "Attendance": 20,
  "Quiz": 20,
  "Midterm": 20,
  "Final": 40
};

// Controller function to create a new exam
const createExam = async (req, res) => {
  try {
    // Extract data from the request body
    const { Term, ExamType, ExamWeightage, AnnouncedDate, ReportDeadline, partStatus, portalCategory, program, department } =
      req.body;

    console.log("Term", Term);
    console.log("ExamType", ExamType);
    console.log("ExamWeightage", ExamWeightage);
    console.log("AnnouncedDate", AnnouncedDate);
    console.log("ReportDeadline", ReportDeadline);
    console.log("partStatus", partStatus);
    console.log("portalCategory", portalCategory);
    console.log("Program", program);
    console.log("Department from body", department);

    if (!partStatus || !portalCategory || !program) {
      return res.status(400).json({ error: "partStatus, portalCategory, and program are required" });
    }

    const coordUser = await GenUser.findById(req.user_id);
    if (!coordUser) {
      return res.status(404).json({ error: "Coordinator user not found" });
    }
    const departmentId = department || coordUser.department;

    if (!departmentId) {
      return res.status(400).json({ error: "Department is required" });
    }

    // --- PROMOTION PHASE VALIDATION ---
    const termQuery = mongoose.Types.ObjectId.isValid(Term) 
      ? { $in: [new mongoose.Types.ObjectId(Term), Term.toString()] }
      : Term;

    const programQuery = mongoose.Types.ObjectId.isValid(program)
      ? { $in: [new mongoose.Types.ObjectId(program), program.toString()] }
      : program;

    const promotedGroupsCount = await FypRegistration.countDocuments({
      term: termQuery,
      "groupMembers.program": programQuery,
      partStatus: "part-II"
    });

    const isPromoted = promotedGroupsCount > 0;

    if (partStatus === "Part-II" && !isPromoted) {
      return res.status(400).json({
        error: "Part-II exams cannot be created because this term and program has not yet completed Part-I and gone through the promotion phase."
      });
    }

    if (partStatus === "Part-I" && isPromoted) {
      return res.status(400).json({
        error: "Part-I exams cannot be created because this term and program has already completed the promotion phase and is officially in Part-II."
      });
    }

    // --- PART STATUS WEIGHTAGE VALIDATION ---
    const existingExamsInPart = await CreateExam.find({ 
      Term: Term, 
      partStatus: partStatus,
      program: program
    });
    
    const currentTotalWeight = existingExamsInPart.reduce((sum, e) => sum + Number(e.ExamWeightage || 0), 0);
    const requestedWeight = Number(ExamWeightage);
    const remainingWeight = 100 - currentTotalWeight;

    if (requestedWeight > remainingWeight) {
      return res.status(400).json({ 
        error: `Weightage limit exceeded! The maximum weightage left for this program's ${partStatus} is ${remainingWeight}%. You tried to assign ${requestedWeight}%.`
      });
    }

    console.log(`[DEBUG] Attempting to create exam: Term=${Term}, Type=${ExamType}, Part=${partStatus}, Cat=${portalCategory}, Program=${program}, Department=${departmentId}`);

    // Check if there is already an exam for the given term, type, and program
    const existingExam = await CreateExam.findOne({ Term, ExamType, program });

    if (existingExam) {
      console.log(`Exam already exists for this term, type, and program.`);
      return res.status(400).json({ error: "This exam has already been created for this program in this term and you cannot create another one." });
    }

    // Create a new exam object
    const newExamData = {
      Term,
      ExamType,
      ExamWeightage,
      AnnouncedDate,
      partStatus,
      portalCategory,
      program,
      department: departmentId
    };

    // Include ReportDeadline field if provided in the request body
    if (ReportDeadline) {
      newExamData.ReportDeadline = ReportDeadline;
    }

    // Create a new exam document
    const newExam = new CreateExam(newExamData);

    // Save the new exam to the database
    await newExam.save();

    // Return success response for the creation
    return res.status(201).json({
      message: "Exam created successfully",
      exam: newExam,
    });
  } catch (error) {
    console.error("Error creating exam:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const countCreatedExams = async (req, res) => {
  try {
    // Count the total number of exams in the CreateExam collection
    const totalExams = await CreateExam.countDocuments();

    // Return the total count
    res.status(200).json({ totalExams });
  } catch (error) {
    console.error("Error counting exams:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get all exams
const getAllExams = async (req, res) => {
  console.log("Getting All exams Calleddddddddddd");
  try {
    // Fetch all exams from the database
    const exams = await CreateExam.find()
      .populate("Term") // Populate the Term field
      .populate("ExamType") // Populate the ExamType field
      .populate("program")
      .populate("department");

    const activeExams = exams.filter(exam => exam.Term && exam.Term.status === "activated");
    console.log(`[DEBUG] getAllExams found ${exams.length} exams. Returning ${activeExams.length} active exams.`);
    // Return the fetched exams
    res.status(200).json({ exams: activeExams });
  } catch (error) {
    console.error("Error fetching exams:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllCreatedExams = async (req, res) => {
  try {
    // Fetch all exams from the database
    const exams = await CreateExam.find()
      .populate("Term") // Populate the Term field
      .populate("ExamType") // Populate the ExamType field
      .populate("program")
      .populate("department");

    const activeExams = exams.filter(exam => exam.Term && exam.Term.status === "activated");
    // Return the fetched exams
    res.status(200).json({ exams: activeExams });
  } catch (error) {
    console.error("Error fetching exams:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSpecificExam = async (req, res) => {
  console.log("Inside get specific Exam");
  try {
    const { termId } = req.params;
    const { role } = req.query;
    console.log("Checking term:", termId);
    console.log("Checking roleeeeeeeeeeeeeeeeeee:", role);

    // Fetch exams that match the given term and have AnnouncedDate equal to the current date
    const exams = await CreateExam.find({
      Term: termId,
      AnnouncedDate: { $eq: new Date().toISOString().split("T")[0] },
    })
      .populate("Term")
      .populate("ExamType")
      .populate("program")
      .populate("department");

    const filteredExams = exams.filter((exam) => {
      if (!exam.ExamType) return false;
      const termActive = exam.Term && exam.Term.status === "activated";
      if (!termActive) return false;
      if (role === "Examiner") {
        return exam.ExamType.examTypeFor === "All";
      } else if (role === "Supervisor") {
        return exam.ExamType.examTypeFor === "Supervisor";
      } else if (role === "HoD") {
        return exam.ExamType.examTypeFor === "HoD";
      } else if (role === "Student") {
        return exam.ExamType.examTypeFor === "All" || exam.ExamType.examTypeFor === "Student";
      }
      return exam.ExamType.examTypeFor === role;
    });

    if (filteredExams.length === 0) {
      return res
        .status(404)
        .json({ message: "No exams found for the given term and role" });
    }
    console.log("Filtered Exams:", filteredExams);

    // Return the fetched exams
    res.status(200).json({ exams: filteredExams });
  } catch (error) {
    console.error("Error fetching specific exams:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSpecificCreatedExam = async (req, res) => {
  console.log("Inside get specific created exam");

  try {
    let { role, termId, programId } = req.query;
    console.log("Checking role on back end:", role);
    console.log("Checking term on back end:", termId);
    console.log("Checking programId on back end:", programId);

    const user = await GenUser.findById(req.user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const query = { status: "Active" };
    const lowerRole = role?.toLowerCase();

    if (lowerRole === "student") {
      query.program = user.program;
    } else if (lowerRole === "coordinator") {
      query.department = user.department;
    } else if (lowerRole === "supervisor" || lowerRole === "examiner") {
      if (programId) {
        query.program = programId;
      } else {
        query.department = user.department;
      }
    }

    const exams = await CreateExam.find(query)
      .populate("Term")
      .populate("ExamType")
      .populate("program")
      .populate("department")
      .exec();

    console.log("Fetched exams matching query:", exams);

    const filteredExams = exams.filter((exam) => {
      const termMatch = exam.Term && exam.Term._id.toString() === termId && exam.Term.status === "activated";
      let roleMatch = false;
      if (exam.ExamType) {
        const examTypeForLower = exam.ExamType.examTypeFor?.toLowerCase();
        if (lowerRole === "examiner") {
          roleMatch = examTypeForLower === "all" || examTypeForLower === "examiner";
        } else if (lowerRole === "supervisor") {
          roleMatch = examTypeForLower === "supervisor";
        } else if (lowerRole === "hod") {
          roleMatch = examTypeForLower === "hod" || examTypeForLower === "all";
        } else if (lowerRole === "student") {
          roleMatch = examTypeForLower === "all" || examTypeForLower === "student";
        } else {
          roleMatch = examTypeForLower === lowerRole;
        }
      }
      return termMatch && roleMatch;
    });

    if (filteredExams.length === 0) {
      return res.status(200).json({ exams: [], message: "No exams found for the given role and term" });
    }

    console.log("Filtered Exams:", filteredExams);

    const exam = filteredExams[0];
    if (exam.ExamType.examTypeFor === "Supervisor" || exam.ExamType.examName === "Attendance") {
      return res.status(200).json({ exams: filteredExams });
    } else {
      const examDetailsResult = await ScheduleController.getExamDetails(exam._id);
      return res.status(200).json({ exams: filteredExams, schedule: examDetailsResult.exam });
    }
  } catch (error) {
    console.error("Error fetching specific created exams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSpecificCreatedExamOreient = async (req, res) => {
  console.log("Inside get specific created exam orient");

  try {
    let { role } = req.query;
    console.log("Checking role on back end:", role);

    const user = await GenUser.findById(req.user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const query = { status: "Active" };
    const lowerRole = role?.toLowerCase();

    if (lowerRole === "coordinator") {
      query.department = user.department;
    } else if (lowerRole === "student") {
      query.program = user.program;
    } else if (lowerRole === "supervisor" || lowerRole === "examiner") {
      query.department = user.department;
    }

    const exams = await CreateExam.find(query)
      .populate("Term")
      .populate("ExamType")
      .populate("program")
      .populate("department")
      .exec();

    console.log("All fetched exams for orient:", exams);

    const filteredExams = exams.filter((exam) => {
      if (!exam.ExamType) return false;
      const termActive = exam.Term && exam.Term.status === "activated";
      if (!termActive) return false;
      const examTypeForLower = exam.ExamType.examTypeFor?.toLowerCase();
      if (lowerRole === "coordinator") {
        return examTypeForLower === "coordinator";
      }
      return examTypeForLower === "all" || examTypeForLower === lowerRole;
    });

    if (filteredExams.length === 0) {
      return res
        .status(404)
        .json({ message: "No exams found for the given role" });
    }

    console.log("Filtered Exams orient:", filteredExams);

    const exam = filteredExams[0];
    if (exam.ExamType.examTypeFor === "Supervisor" || exam.ExamType.examName === "Attendance") {
      return res.status(200).json({ exams: filteredExams });
    } else {
      try {
        const examDetailsResult = await ScheduleController.getExamDetails(
          exam._id
        );
        if (examDetailsResult.message) {
          return res.status(404).json({ message: examDetailsResult.message });
        }

        return res
          .status(200)
          .json({ exams: filteredExams, schedule: examDetailsResult.exam });
      } catch (error) {
        console.error("Error fetching exam details:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  } catch (error) {
    console.error("Error fetching specific created exams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const assignCLOForExam = async (req, res) => {
  try {
    const { examId, cloForExamId } = req.body;

    // Find the exam by ID
    const exam = await CreateExam.findById(examId);

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Assign the CLOForExam to the exam
    exam.CLOForExams = cloForExamId;

    // Save the updated exam to the database
    await exam.save();

    // Return success response
    res
      .status(200)
      .json({ message: "CLOForExam assigned to exam successfully", exam });
  } catch (error) {
    console.error("Error assigning CLOForExam to exam:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const mongoose = require("mongoose");
    const CreateExamSchedule = require("../../models/CoordinatorModels/ExamScheduleModel");
    const Evaluation = require("../../models/CoordinatorModels/EvaluateExamModel");
    const Result = require("../../models/CoordinatorModels/ResultsModel");

    const examIds = [examId];
    if (mongoose.Types.ObjectId.isValid(examId)) {
      examIds.push(new mongoose.Types.ObjectId(examId));
    }

    console.log("Cascading deletion initiated for Exam ID:", examId);

    // 1. Delete associated exam schedules
    const deletedSchedules = await CreateExamSchedule.deleteMany({ CreatedExam: { $in: examIds } });
    console.log(`Deleted ${deletedSchedules.deletedCount} exam schedules for exam ID: ${examId}`);

    // 2. Pull the exam from Evaluation marks
    const updatedEvaluations = await Evaluation.updateMany(
      { "terms.exams.examId": { $in: examIds } },
      { $pull: { "terms.$[].exams": { examId: { $in: examIds } } } }
    );
    console.log(`Updated evaluation marks: matched ${updatedEvaluations.matchedCount}, modified ${updatedEvaluations.modifiedCount}`);

    // 3. Pull the exam from student results (if applicable)
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
    console.log(`Updated results. Matched: ${updatedResults.matchedCount}, modified: ${updatedResults.modifiedCount}`);

    // 4. Find the exam by ID and delete it
    const deletedExam = await CreateExam.findByIdAndDelete(examId);

    if (!deletedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Return success response
    res
      .status(200)
      .json({ message: "Exam and all associated data deleted successfully", exam: deletedExam });
  } catch (error) {
    console.error("Error deleting exam:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateExamStatus = async (req, res) => {
  try {
    const { examId } = req.params;
    const { status } = req.body;

    const updatedExam = await CreateExam.findByIdAndUpdate(
      examId,
      { status },
      { new: true }
    );

    if (!updatedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json({ message: "Status updated", exam: updatedExam });
  } catch (error) {
    console.error("Error updating exam status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createExam,
  getAllExams,
  assignCLOForExam,
  getSpecificExam,
  countCreatedExams,
  getAllCreatedExams,
  getSpecificCreatedExam,
  getSpecificCreatedExamOreient,
  deleteExam,
  updateExamStatus,
};
