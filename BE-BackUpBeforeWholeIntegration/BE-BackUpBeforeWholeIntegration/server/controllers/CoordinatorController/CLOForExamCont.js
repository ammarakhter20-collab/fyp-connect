// const CLOForExam = require("../../models/CoordinatorModels/CLOForExamModel");
// const CLO = require("../../models/CoordinatorModels/CLOsModel");
// const mongoose = require("mongoose");

// // Controller function to add CLOs to a CLOForExam document

// const createCLOForExam = async (req, res) => {
//   try {
//     // Extract data from the request body
//     const { shortCode, program, selectExam } = req.body;

//     // Create a new CLOForExam object
//     const newCLOForExam = new CLOForExam({
//       shortCode,
//       program,
//       // selectExam,
//     });

//     // Save the CLOForExam to the database
//     await newCLOForExam.save();

//     // Return success response
//     res.status(201).json({
//       message: "CLOForExam created successfully",
//       CLOForExam: newCLOForExam,
//     });
//   } catch (error) {
//     console.error("Error creating CLOForExam:", error);
//     // Return error response
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const getAllCLOForExam = async (req, res) => {
//   try {
//     console.log("Getting ALL CLO for Exam Called");
//     // Fetch all CLOs for exam from the database and populate both CLOs and Questions, and selectExam
//     const CLOsForExam = await CLOForExam.find()
//       .populate({
//         path: "CLOs",
//         populate: { path: "Questions" }, // Populate Questions inside CLOs
//       })
//       // .populate("selectExam")
//       .populate("program"); // Populate selectExam

//     // Return the fetched CLOs for exam
//     res.status(200).json({ CLOsForExam });
//   } catch (error) {
//     console.error("Error fetching CLOs for exam:", error);
//     // Return error response
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Controller function to get a particular CLO for exam by ID
// const getParticularCLOForExam = async (req, res) => {
//   console.log("inside get particular Exam for CLO");
//   try {
//     const { id } = req.params;
//     console.log("Checking id", id);

//     // Find the CLO for exam by ID and populate selectExam
//     const CLOsForExam = await CLOForExam.findById(id).populate({
//       path: "CLOs",
//       populate: { path: "Questions" }, // Populate Questions inside CLOs
//     });
//     // .populate("selectExam");

//     console.log("Fetched CLO", CLOsForExam);

//     if (!CLOsForExam) {
//       return res.status(404).json({ error: "CLOForExam not found" });
//     }

//     // Return the fetched CLO for exam
//     res.status(200).json({ CLOsForExam });
//   } catch (error) {
//     console.error("Error fetching CLO for exam:", error);
//     // Return error response
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const deleteExamCLO = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the CLOForExam document by ID and remove it
//     const deletedCLOForExam = await CLOForExam.findByIdAndRemove(id);

//     if (!deletedCLOForExam) {
//       return res.status(404).json({ error: "CLOForExam not found" });
//     }

//     // Return success response
//     res.status(200).json({ message: "CLOForExam deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting CLOForExam:", error);
//     // Return error response
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const addCLOsToExam = async (req, res) => {
//   try {
//     const { cloForExamId, cloIds } = req.body;
//     console.log("Checking CLoForExamId", cloForExamId);
//     console.log("Checking CLOId", cloIds);

//     // Find the CLOForExam document by ID
//     const cloForExam = await CLOForExam.findById(cloForExamId);
//     console.log("CLoForExam after Finding", cloForExam);

//     if (!cloForExam) {
//       return res.status(404).json({ error: "CLOForExam not found" });
//     }

//     // Ensure cloIds is an array and convert each item to an ObjectId
//     if (Array.isArray(cloIds)) {
//       cloIds.forEach((cloId) => {
//         // Add each ObjectId to the CLOs array
//         cloForExam.CLOs.push(new mongoose.Types.ObjectId(cloId));
//       });
//     } else {
//       return res.status(400).json({ error: "CLOIds must be an array" });
//     }

//     // Save the updated CLOForExam document to the database
//     await cloForExam.save();

//     // Return success response
//     res
//       .status(200)
//       .json({ message: "CLO added to CLOForExam successfully", cloForExam });
//   } catch (error) {
//     console.error("Error adding CLO to CLOForExam:", error);
//     // Return error response
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = {
//   addCLOsToExam,
//   createCLOForExam,
//   deleteExamCLO,
//   getAllCLOForExam,
//   getParticularCLOForExam,
// };

const CLOForExam = require("../../models/CoordinatorModels/CLOForExamModel");
const CLO = require("../../models/CoordinatorModels/CLOsModel");
const mongoose = require("mongoose");

// Controller function to add CLOs to a CLOForExam document

const createCLOForExam = async (req, res) => {
  try {
    // Extract data from the request body
    const { shortCode, program, selectExam } = req.body;

    // Create a new CLOForExam object
    const newCLOForExam = new CLOForExam({
      shortCode,
      program,
      // selectExam,
    });

    // Save the CLOForExam to the database
    await newCLOForExam.save();

    // Return success response
    res.status(201).json({
      message: "CLOForExam created successfully",
      CLOForExam: newCLOForExam,
    });
  } catch (error) {
    console.error("Error creating CLOForExam:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllCLOForExam = async (req, res) => {
  try {
    console.log("Getting ALL CLO for Exam Called");

    // Fetch all CLOs for exam from the database and populate both CLOs and Questions, and Program inside each CLO
    const CLOsForExam = await CLOForExam.find()
      .populate({
        path: "CLOs",
        populate: [{ path: "Questions" }, { path: "Program" }],
      })
      .populate("program");

    // Return the fetched CLOs for exam
    res.status(200).json({ CLOsForExam });
  } catch (error) {
    console.error("Error fetching CLOs for exam:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get a particular CLO for exam by ID
const getParticularCLOForExam = async (req, res) => {
  console.log("inside get particular Exam for CLO");
  try {
    const { id } = req.params;
    console.log("Checking id", id);

    // Find the CLO for exam by ID and populate selectExam
    const CLOsForExam = await CLOForExam.findById(id).populate({
      path: "CLOs",
      populate: { path: "Questions" }, // Populate Questions inside CLOs
    });
    // .populate("selectExam");

    console.log("Fetched CLO", CLOsForExam);

    if (!CLOsForExam) {
      return res.status(404).json({ error: "CLOForExam not found" });
    }

    // Return the fetched CLO for exam
    res.status(200).json({ CLOsForExam });
  } catch (error) {
    console.error("Error fetching CLO for exam:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteExamCLO = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the CLOForExam document by ID and remove it
    const deletedCLOForExam = await CLOForExam.findByIdAndDelete(id);

    if (!deletedCLOForExam) {
      return res.status(404).json({ error: "CLOForExam not found" });
    }

    // Return success response
    res.status(200).json({ message: "CLOForExam deleted successfully" });
  } catch (error) {
    console.error("Error deleting CLOForExam:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const addCLOsToExam = async (req, res) => {
  try {
    const { cloForExamId, cloIds } = req.body;
    console.log("Checking CLoForExamId", cloForExamId);
    console.log("Checking CLOId", cloIds);

    // Find the CLOForExam document by ID
    const cloForExam = await CLOForExam.findById(cloForExamId);
    console.log("CLoForExam after Finding", cloForExam);

    if (!cloForExam) {
      return res.status(404).json({ error: "CLOForExam not found" });
    }

    // Ensure cloIds is an array and convert each item to an ObjectId
    if (Array.isArray(cloIds)) {
      cloIds.forEach((cloId) => {
        // Add each ObjectId to the CLOs array
        cloForExam.CLOs.push(new mongoose.Types.ObjectId(cloId));
      });
    } else {
      return res.status(400).json({ error: "CLOIds must be an array" });
    }

    // Save the updated CLOForExam document to the database
    await cloForExam.save();

    // Return success response
    res
      .status(200)
      .json({ message: "CLO added to CLOForExam successfully", cloForExam });
  } catch (error) {
    console.error("Error adding CLO to CLOForExam:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};
const removeCLOFromExam = async (req, res) => {
  try {
    const { cloForExamIdToRemove, cloIdToRemove } = req.body;
    console.log("CLOForExamId:", cloForExamIdToRemove);
    console.log("CLOId:", cloIdToRemove);

    // Find the CLOForExam document by ID
    const cloForExam = await CLOForExam.findById(cloForExamIdToRemove);
    if (!cloForExam) {
      return res.status(404).json({ error: "CLOForExam not found" });
    }

    // Find the index of the CLO in the CLOs array
    const cloIndex = cloForExam.CLOs.indexOf(cloIdToRemove);
    if (cloIndex === -1) {
      return res.status(404).json({ error: "CLO not found in ExamCLO" });
    }

    // Remove the CLO from the CLOs array
    cloForExam.CLOs.splice(cloIndex, 1);

    // Save the updated CLOForExam document to the database
    await cloForExam.save();

    // Return success response
    res.status(200).json({
      message: "CLO removed from ExamCLO successfully",
      cloForExam,
    });
  } catch (error) {
    console.error("Error removing CLO from ExamCLO:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addCLOsToExam,
  createCLOForExam,
  deleteExamCLO,
  getAllCLOForExam,
  getParticularCLOForExam,
  removeCLOFromExam,
};
