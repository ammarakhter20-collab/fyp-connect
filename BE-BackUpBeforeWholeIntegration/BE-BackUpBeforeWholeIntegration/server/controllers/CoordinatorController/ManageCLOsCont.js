const ManageCLO = require("../../models/CoordinatorModels/CLOsModel");
const mongoose = require("mongoose");

// Controller function to create a new CLO
const createCLO = async (req, res) => {
  try {
    // Extract data from the request body
    const { CLOCode, Title, Program } = req.body;

    console.log("Checking Program in manage CLO", Program);

    // Create a new CLO object
    const newCLO = new ManageCLO({
      CLOCode,
      Title,
      Program,
    });

    // Save the CLO to the database
    await newCLO.save();

    // Return success response
    res.status(201).json({
      message: "CLO created successfully",
      CLO: newCLO,
    });
  } catch (error) {
    console.error("Error creating CLO:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get all CLOs
const getAllCLOs = async (req, res) => {
  try {
    // Fetch all CLOs from the database and populate the Questions field
    const CLOs = await ManageCLO.find()
      .populate("Questions")
      .populate("Program");

    // Return the fetched CLOs
    res.status(200).json({ CLOs });
  } catch (error) {
    console.error("Error fetching CLOs:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const getParticularCLO = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the CLO by ID
    const clo = await ManageCLO.findById(id).populate("Questions");

    if (!clo) {
      return res.status(404).json({ error: "CLO not found" });
    }

    // Return the fetched CLO
    res.status(200).json({ clo });
  } catch (error) {
    console.error("Error fetching particular CLO:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to update a CLO
const updateCLO = async (req, res) => {
  try {
    // Extract data from the request body
    const { CLOCode, Title } = req.body;
    const { id } = req.params;

    // Find the CLO by ID
    const clo = await ManageCLO.findById(id);

    if (!clo) {
      return res.status(404).json({ error: "CLO not found" });
    }

    // Update the CLO fields
    clo.CLOCode = CLOCode;
    clo.Title = Title;

    // Save the updated CLO to the database
    await clo.save();

    // Return success response
    res.status(200).json({ message: "CLO updated successfully", clo });
  } catch (error) {
    console.error("Error updating CLO:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to delete a CLO
const deleteCLO = async (req, res) => {
  console.log("Delete CLO");
  try {
    const { id } = req.params;
    console.log("Checking Id", id);

    // Find the CLO by ID and delete it
    const deletedCLO = await ManageCLO.findByIdAndDelete(id);
    if (!deletedCLO) {
      return res.status(404).json({ error: "CLO not found" });
    }

    // Return success response
    res.status(200).json({ message: "CLO deleted successfully" });
  } catch (error) {
    console.error("Error deleting CLO:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const assignQuestionToCLO = async (req, res) => {
  try {
    const { CLOId, questionIds } = req.body;

    console.log("Checking Questions ID", questionIds);

    // Find the CLO by ID
    const clo = await ManageCLO.findById(CLOId);

    if (!clo) {
      return res.status(404).json({ error: "CLO not found" });
    }

    // Ensure questionIds is an array and not empty
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ error: "Invalid question IDs" });
    }

    // Convert the array of question IDs to an array of ObjectId instances
    const questionObjectIds = questionIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // Add the question ObjectId(s) to the CLO's Questions array
    clo.Questions.push(...questionObjectIds);

    // Save the updated CLO to the database
    await clo.save();

    // Return success response
    res
      .status(200)
      .json({ message: "Question assigned to CLO successfully", clo });
  } catch (error) {
    console.error("Error assigning question to CLO:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const delQuesInClo = async (req, res) => {
  try {
    const { CLOId, questionId } = req.body;

    // Find the CLO by ID
    const clo = await ManageCLO.findById(CLOId);

    if (!clo) {
      return res.status(404).json({ error: "CLO not found" });
    }

    // Remove the question from the CLO's Questions array
    const index = clo.Questions.indexOf(questionId);
    if (index !== -1) {
      clo.Questions.splice(index, 1);
    } else {
      return res.status(404).json({ error: "Question not found in CLO" });
    }

    // Save the updated CLO to the database
    await clo.save();

    // Return success response
    res
      .status(200)
      .json({ message: "Question deleted from CLO successfully", clo });
  } catch (error) {
    console.error("Error deleting question from CLO:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeQuestionFromCLO = async (req, res) => {
  try {
    const { CLOIdToRemove, questionIdRemove } = req.body;

    console.log("CLOId:", CLOIdToRemove);
    console.log("QuestionId:", questionIdRemove);

    // Find the CLO by ID
    const clo = await ManageCLO.findById(CLOIdToRemove);
    if (!clo) {
      return res.status(404).json({ error: "CLO not found" });
    }

    // Find the index of the question in the Questions array
    const questionIndex = clo.Questions.indexOf(questionIdRemove);
    if (questionIndex === -1) {
      return res.status(404).json({ error: "Question not found in CLO" });
    }

    // Remove the question from the Questions array
    clo.Questions.splice(questionIndex, 1);

    // Save the updated CLO to the database
    await clo.save();

    // Return success response
    res.status(200).json({
      message: "Question removed from CLO successfully",
      clo,
    });
  } catch (error) {
    console.error("Error removing question from CLO:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  createCLO,
  getAllCLOs,
  updateCLO,
  deleteCLO,
  assignQuestionToCLO,
  delQuesInClo,
  getParticularCLO,
  removeQuestionFromCLO,
};
