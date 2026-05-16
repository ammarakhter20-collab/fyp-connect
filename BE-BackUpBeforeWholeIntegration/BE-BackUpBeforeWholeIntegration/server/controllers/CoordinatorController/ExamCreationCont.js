const CreateExam = require("../../models/CoordinatorModels/ExamCreationModel");
const ScheduleController = require("../../controllers/CoordinatorController/ExamScheduleCont");

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
    const { Term, ExamType, ExamWeightage, AnnouncedDate, ReportDeadline, partStatus, portalCategory } =
      req.body;

    console.log("Term", Term);
    console.log("ExamType", ExamType);
    console.log("ExamWeightage", ExamWeightage);
    console.log("AnnouncedDate", AnnouncedDate);
    console.log("ReportDeadline", ReportDeadline);
    console.log("partStatus", partStatus);
    console.log("portalCategory", portalCategory);

    if (!partStatus || !portalCategory) {
      return res.status(400).json({ error: "partStatus and portalCategory are required" });
    }

    // --- RESOURCE ALLOCATION VALIDATION (TEMPORARILY DISABLED) ---
    // if (CATEGORY_CAPACITIES[portalCategory]) {
    //   const maxWeight = CATEGORY_CAPACITIES[portalCategory];
    //   const existingExamsInCategory = await CreateExam.find({ 
    //     Term: Term, 
    //     partStatus: partStatus, 
    //     portalCategory: portalCategory 
    //   });
    //   const currentAllocatedWeight = existingExamsInCategory.reduce((sum, e) => sum + e.ExamWeightage, 0);
    //   if (currentAllocatedWeight + Number(ExamWeightage) > maxWeight) {
    //     return res.status(400).json({ 
    //       error: `Resource Overload! ${portalCategory} category in ${partStatus} only has ${maxWeight - currentAllocatedWeight}% space remaining.` 
    //     });
    //   }
    // }
    console.log(`[DEBUG] Attempting to create exam: Term=${Term}, Type=${ExamType}, Part=${partStatus}, Cat=${portalCategory}`);

    // Check if there is already an exam for the given term and type
    const existingExam = await CreateExam.findOne({ Term, ExamType });

    if (existingExam) {
      console.log(`Exam already exists for this term and type.`);
      return res.status(400).json({ error: "An exam of this type has already been created for this term." });
    }

    // Create a new exam object
    const newExamData = {
      Term,
      ExamType,
      ExamWeightage,
      AnnouncedDate,
      partStatus,
      portalCategory
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
      .populate("ExamType"); // Populate the ExamType field

    console.log(`[DEBUG] getAllExams found ${exams.length} exams.`);
    // Return the fetched exams
    res.status(200).json({ exams });
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
      .populate("ExamType"); // Populate the ExamType field

    // Return the fetched exams
    res.status(200).json({ exams });
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
      .populate("ExamType");

    // Filter exams based on ExamType's examTypeFor field
    const filteredExams = exams.filter(
      (exam) =>
        exam.ExamType.examTypeFor === "All" ||
        exam.ExamType.examTypeFor === role
    );

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

// const getSpecificCreatedExam = async (req, res) => {
//   console.log("Inside get specific created exam");

//   try {
//     const { role } = req.query;
//     console.log("Checking role on back end  :", role);

//     // Fetch exams that have ExamType.examTypeFor equal to 'All' or the given role
//     const exams = await CreateExam.find().populate("Term").populate("ExamType");

//     // Filter exams based on ExamType's examTypeFor field
//     const filteredExams = exams.filter(
//       (exam) =>
//         exam.ExamType.examTypeFor === "All" ||
//         exam.ExamType.examTypeFor === role
//     );

//     if (filteredExams.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No exams found for the given role" });
//     }
//     console.log("Filtered Exams:", filteredExams);

//     // Return the fetched exams
//     res.status(200).json({ exams: filteredExams });
//   } catch (error) {
//     console.error("Error fetching specific created exams:", error);
//     // Return error response
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const getSpecificCreatedExam = async (req, res) => {
  console.log("Inside get specific created exam");

  try {
    let { role, termId } = req.query;
    console.log("Checking role on back end:", role);
    console.log("Checking term on back end:", termId);

    // if (role === "faculty") {
    //   role = "Supervisor";
    // }
    console.log("Updated Role: ", role);

    const exams = await CreateExam.find({ status: "Active" })
      .populate("Term")
      .populate("ExamType")
      .exec();

    console.log("All fetched exams:", exams);

    const filteredExams = exams.filter(
      (exam) => {
        const termMatch = exam.Term && exam.Term._id.toString() === termId;
        const roleMatch = exam.ExamType && (exam.ExamType.examTypeFor === "All" || exam.ExamType.examTypeFor === role);
        console.log(`DEBUG: Exam: ${exam.ExamType?.examName}, TargetRole: ${exam.ExamType?.examTypeFor}, UserRole: ${role}, TermMatch: ${termMatch}, RoleMatch: ${roleMatch}`);
        return termMatch && roleMatch;
      }
    );

    if (filteredExams.length === 0) {
      console.log(`DEBUG: No matches for Term: ${termId}, Role: ${role}`);
      return res
        .status(404)
        .json({ message: "No exams found for the given role and term" });
    }

    console.log("Filtered Exams:", filteredExams);

    const exam = filteredExams[0]; // Assuming you want to work with the first matched exam

    if (exam.ExamType.examName === "Attendance") {
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
const getSpecificCreatedExamOreient = async (req, res) => {
  console.log("Inside get specific created exam");

  try {
    let { role } = req.query;
    console.log("Checking role on back end:", role);
    // console.log("Checking term on back end:", termId);

    // if (role === "faculty") {
    //   role = "Supervisor";
    // }
    console.log("Updated Role: ", role);

    const exams = await CreateExam.find({ status: "Active" })
      .populate("Term")
      .populate("ExamType")
      .exec();

    console.log("All fetched exams:", exams);

    const filteredExams = exams.filter(
      (exam) =>
        exam.ExamType && (exam.ExamType.examTypeFor === "All" || exam.ExamType.examTypeFor === role)
    );

    if (filteredExams.length === 0) {
      return res
        .status(404)
        .json({ message: "No exams found for the given role and term" });
    }

    console.log("Filtered Exams:", filteredExams);

    const exam = filteredExams[0]; // Assuming you want to work with the first matched exam

    if (exam.ExamType.examName === "Attendance") {
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

    // Find the exam by ID and delete it
    const deletedExam = await CreateExam.findByIdAndDelete(examId);

    if (!deletedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Return success response
    res
      .status(200)
      .json({ message: "Exam deleted successfully", exam: deletedExam });
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
