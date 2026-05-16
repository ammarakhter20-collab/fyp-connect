// Assuming you have a Supervisor model defined with Mongoose
const Supervisor = require("../../models/AdminModels/GenUserModel");

// Controller function to handle fetching supervisor details by ID
const getSupervisorById = async (req, res) => {
  const { id } = req.params; // Get the supervisor ID from the request parameters
  try {
    const supervisor = await Supervisor.findById(id); // Find supervisor by ID
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }
    // Return supervisor details
    res
      .status(200)
      .json({
        name: supervisor.name,
        email: supervisor.email /* Add other fields as needed */,
      });
  } catch (error) {
    console.error("Error fetching supervisor by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Export the controller function
module.exports = { getSupervisorById };
