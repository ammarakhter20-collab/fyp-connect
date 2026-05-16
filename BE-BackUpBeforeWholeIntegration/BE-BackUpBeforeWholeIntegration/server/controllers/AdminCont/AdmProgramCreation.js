const Program = require("../../models/AdminModels/program");
const Department = require("../../models/AdminModels/department");

const createProgram = async (req, res) => {
  console.log("Inside program creation");
  try {
    // const { programTitle, shortCode, department, term } = req.body;
    const { programTitle, shortCode, department } = req.body;
    console.log("Program title ", programTitle);
    console.log("Short code ", shortCode);
    console.log("Program title ", department);
    // console.log("Program title ", term);

    // You can validate the incoming data here if needed

    // Create a new program instance

    const program = await Program.create({
      programTitle,
      shortCode,
      department,
      // term,
    });

    res.status(201).json({ program });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProgramsData = async (req, res) => {
  try {
    // Fetch all programs and populate department and term fields
    const programs = await Program.find().populate("department");

    res.status(200).json({ programs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDepartmentsData = async (req, res) => {
  try {
    // Fetch all departments
    const departments = await Department.find();

    res.status(200).json({ departments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchProgramCount = async (req, res) => {
  try {
    // Get the count of programs
    const programCount = await Program.countDocuments();

    // Return the program count in the response
    res.status(200).json({ count: programCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProgramData = async (req, res) => {
  console.log("Inside program update controller");
  const { programId } = req.body; // Extract programId from req body
  // const { programTitle, shortCode, department, term } = req.body;
  const { programTitle, shortCode, department } = req.body;

  try {
    // Find the program by ID and update its data
    const updatedProgram = await Program.findByIdAndUpdate(
      programId,
      // { programTitle, shortCode, department, term },
      { programTitle, shortCode, department },
      { new: true } // Return the updated document
    ).populate("department");

    if (!updatedProgram) {
      return res.status(404).json({ message: "Program not found." });
    }

    console.log("Program updated successfully:", updatedProgram._id);
    res.status(200).json({ updatedProgram });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProgram = async (req, res) => {
  console.log("Inside deleteProgram");
  try {
    console.log("Check id pass in body", req.body.programId);
    const programId = req.body.programId; // Extract programId from request body
    console.log("Checking id in variable ", programId);
    console.log("Program id inside delete", programId);
    const deletedProgram = await Program.findByIdAndDelete(programId);

    if (!deletedProgram) {
      return res.status(404).json({ message: "Program not found." });
    }

    console.log("Program deleted successfully:", deletedProgram._id);
    res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createProgram,
  getProgramsData,
  updateProgramData,
  deleteProgram,
  fetchProgramCount,
  getDepartmentsData,
};
