const ExamType = require("../../models/CoordinatorModels/ExamTypeModel");

// Controller function to create a new exam type
const createExamType = async (req, res) => {
  try {
    // Extract data from the request body
    const { examName, shortCode, examTypeFor } = req.body;

    // Create a new exam type object
    const examType = new ExamType({
      examName,
      shortCode,
      examTypeFor,
    });

    // Save the exam type to the database
    await examType.save();

    // Return success response
    res
      .status(201)
      .json({ message: "Exam type created successfully", examType });
  } catch (error) {
    console.error("Error creating exam type:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get all exam types
const getAllExamTypes = async (req, res) => {
  console.log("Get All Exam Types of Function Called");
  try {
    // Fetch all exam types from the database
    const examTypes = await ExamType.find();

    // Return the fetched exam types
    res.status(200).json({ examTypes });
  } catch (error) {
    console.error("Error fetching exam types:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateExamType = async (req, res) => {
  console.log("Update Exam Type Running");
  try {
    // Extract data from the request body
    const { examName, shortCode, examTypeFor } = req.body;
    const { id } = req.params;

    // Find the exam type by ID
    const examType = await ExamType.findById(id);

    if (!examType) {
      return res.status(404).json({ error: "Exam type not found" });
    }

    // Update the exam type fields
    examType.examName = examName;
    examType.shortCode = shortCode;
    examType.examTypeFor = examTypeFor;

    // Save the updated exam type to the database
    await examType.save();

    // Return success response
    res
      .status(200)
      .json({ message: "Exam type updated successfully", examType });
  } catch (error) {
    console.error("Error updating exam type:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteExamType = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the exam type by ID
    const deletedExamType = await ExamType.findByIdAndDelete(id);

    if (!deletedExamType) {
      return res.status(404).json({ error: "Exam type not found" });
    }

    // Return success response
    res
      .status(200)
      .json({ message: "Exam type deleted successfully", deletedExamType });
  } catch (error) {
    console.error("Error deleting exam type:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createExamType,
  getAllExamTypes,
  updateExamType,
  deleteExamType,
};
