const FYPterm = require("../../models/AdminModels/fypTerm");
const Department = require("../../models/AdminModels/department");
const jwt = require("jsonwebtoken");

// controllers/departmentController.js

const createDepartment = async (req, res) => {
  console.log("I am inside createDepartment");
  try {
    // const { departmentName, description, term } = req.body;
    const { departmentName, description } = req.body;
    console.log("Checking departmentName", departmentName);
    console.log("Checking description", description);
    // console.log("department checking term id", term);
    // Check if the term ID is valid
    // const existingTerm = await FYPterm.findById(term);
    // if (!existingTerm) {
    //   return res.status(404).json({ error: "Term not found." });
    // }

    // Create a new department with the specified term
    const department = await Department.create({
      departmentName,
      description,
      // term,
    });

    res.status(201).json({ department });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const findActivatedTermId = async (req, res) => {
  console.log("FindActivatedTermId inside ");
  try {
    // Find terms with status: activated
    const activatedTerms = await FYPterm.find({ status: "activated" });
    console.log("Activated term Id", activatedTerms);
    // Check if activated terms exist
    res.status(200).json({ activatedTerms });
    // if (activatedTerms.length > 2) {
    //   // Get the termId of the first activated term found
    //   const hasMoreThanTwoActivatedTerms = activatedTerms.length > 2;

    // } else {
    //   res.status(404).json({ message: "No activated terms found" });
    // }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDepartmentData = async (req, res) => {
  try {
    // Fetch all departments
    // const departments = await Department.find().populate("term");
    const departments = await Department.find();

    res.status(200).json({ departments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchDepartmentCount = async (req, res) => {
  try {
    // Get the count of departments
    const departmentCount = await Department.countDocuments();

    // Return the department count in the response
    res.status(200).json({ count: departmentCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDepartmentOnId = async (req, res) => {
  try {
    console.log("Inside department on id".req);
    const departmentId = req.params.id; // Correctly access departmentId from req.params.id
    console.log("Department Id", departmentId);

    // Fetch the department by its ID
    const department = await Department.findById(departmentId).populate("term");

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.status(200).json({ department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDepartmentData = async (req, res) => {
  console.log("Inside department update controller");
  const { departmentId } = req.body; // Extract departmentId from req body
  // const { departmentName, description, termId } = req.body;
  const { departmentName, description } = req.body;

  try {
    // Find the department by ID and update its data
    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId,
      // { departmentName, description, term: termId },
      { departmentName, description },
      { new: true } // Return the updated document
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found." });
    }

    console.log("Department updated successfully:", updatedDepartment._id);
    res.status(200).json({ updatedDepartment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  console.log("Inside deleteDepartment");
  try {
    console.log("Check id pass in URL", req.params.id);
    const departmentId = req.params.id; // Extract departmentId from URL params
    console.log("Checking id in variable ", departmentId);
    console.log("Department id inside delete", departmentId);
    const deletedDepartment = await Department.findByIdAndDelete(departmentId);

    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found." });
    }

    console.log("Department deleted successfully:", deletedDepartment._id);
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createDepartment,
  findActivatedTermId,
  getDepartmentData,
  updateDepartmentData,
  deleteDepartment,
  getDepartmentOnId,
  fetchDepartmentCount,
};
