const QuestionsForCLO = require("../../models/CoordinatorModels/QuesForCLOModel");

// Controller function to create a new question for CLO
const createQuestionForCLO = async (req, res) => {
  try {
    // Extract data from the request body
    const { shortCode, question, marks } = req.body;

    // Create a new question for CLO object
    const newQuestionForCLO = new QuestionsForCLO({
      shortCode,
      question,
      marks,
    });

    // Save the question for CLO to the database
    await newQuestionForCLO.save();

    // Return success response
    res.status(201).json({
      message: "Question for CLO created successfully",
      questionForCLO: newQuestionForCLO,
    });
  } catch (error) {
    console.error("Error creating question for CLO:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get all questions for CLO
const getAllQuestionsForCLO = async (req, res) => {
  try {
    // Fetch all questions for CLO from the database
    const questionsForCLO = await QuestionsForCLO.find();

    // Return the fetched questions for CLO
    res.status(200).json({ questionsForCLO });
  } catch (error) {
    console.error("Error fetching questions for CLO:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateQuestionForCLO = async (req, res) => {
  try {
    // Extract data from the request body
    const { shortCode, question, marks } = req.body;
    const { id } = req.params;

    // Find the question for CLO by ID
    let questionForCLO = await QuestionsForCLO.findById(id);

    if (!questionForCLO) {
      return res.status(404).json({ error: "Question for CLO not found" });
    }

    // Update the question for CLO fields
    questionForCLO.shortCode = shortCode;
    questionForCLO.question = question;
    questionForCLO.marks = marks;

    console.log("Checking Updation", questionForCLO);
    // Save the updated question for CLO to the database
    await questionForCLO.save();

    // Return success response
    res.status(200).json({
      message: "Question for CLO updated successfully",
      questionForCLO,
    });
  } catch (error) {
    console.error("Error updating question for CLO:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to delete a question for CLO
const deleteQuestionForCLO = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the question for CLO by ID and delete it
    const deletedQuestionForCLO = await QuestionsForCLO.findByIdAndDelete(id);

    if (!deletedQuestionForCLO) {
      return res.status(404).json({ error: "Question for CLO not found" });
    }

    // Return success response
    res.status(200).json({
      message: "Question for CLO deleted successfully",
      questionForCLO: deletedQuestionForCLO,
    });
  } catch (error) {
    console.error("Error deleting question for CLO:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createQuestionForCLO,
  getAllQuestionsForCLO,
  updateQuestionForCLO,
  deleteQuestionForCLO,
};
