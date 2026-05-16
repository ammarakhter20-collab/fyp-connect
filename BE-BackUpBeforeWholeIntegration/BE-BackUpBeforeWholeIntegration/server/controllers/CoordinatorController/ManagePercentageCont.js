const SupervisorPercentage = require("../../models/CoordinatorModels/ManagePercentageModel");

// Controller function to create a new supervisor percentage
const createSupervisorPercentage = async (req, res) => {
  try {
    // Extract data from the request body
    const { term, program, supervisorPercentage } = req.body;

    // Create a new supervisor percentage object
    const newSupervisorPercentage = new SupervisorPercentage({
      term,
      program,
      supervisorPercentage,
    });

    // Save the supervisor percentage to the database
    await newSupervisorPercentage.save();

    // Return success response
    res.status(201).json({
      message: "Supervisor percentage created successfully",
      supervisorPercentage: newSupervisorPercentage,
    });
  } catch (error) {
    console.error("Error creating supervisor percentage:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get all supervisor percentages
const getAllSupervisorPercentages = async (req, res) => {
  try {
    // Fetch the supervisor percentage from the database
    const supervisorPercentage = await SupervisorPercentage.findOne();

    // Return the fetched supervisor percentage
    res.status(200).json({ supervisorPercentage });
  } catch (error) {
    console.error("Error fetching supervisor percentage:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateSupPercentage = async (req, res) => {
  try {
    // Extract data from the request body
    const { term, program, supervisorPercentage } = req.body;
    const { id } = req.params;

    // Find the supervisor percentage by ID
    const supPercentage = await SupervisorPercentage.findById(id);

    if (!supPercentage) {
      return res.status(404).json({ error: "Supervisor percentage not found" });
    }

    // Update the supervisor percentage fields
    supPercentage.term = term;
    supPercentage.program = program;
    supPercentage.supervisorPercentage = supervisorPercentage;

    // Save the updated supervisor percentage to the database
    await supPercentage.save();

    // Return success response
    res.status(200).json({
      message: "Supervisor percentage updated successfully",
      supervisorPercentage: supPercentage,
    });
  } catch (error) {
    console.error("Error updating supervisor percentage:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createSupervisorPercentage,
  getAllSupervisorPercentages,
  updateSupPercentage,
};
