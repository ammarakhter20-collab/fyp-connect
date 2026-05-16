const CourseCatalog = require("../../models/CoordinatorModels/CourseCatModel");
const GenUser = require("../../models/AdminModels/GenUserModel");
const Program = require("../../models/AdminModels/program");

// Create a new course catalog document
exports.createCourseCatalog = async (req, res) => {
  try {
    const { program, fileTitle, genUser } = req.body;
    console.log("program", program);
    console.log("fileTitle", fileTitle);
    console.log("genUser", genUser);
    console.log("File", req.file.path);

    let pdfFile = "";
    if (req.file) {
      pdfFile = req.file.path; // Save the file path to attachPdf field
    }
    const newCourseCatalog = new CourseCatalog({
      program,
      fileTitle,
      pdfFile,
      genUser,
    });
    const savedCourseCatalog = await newCourseCatalog.save();
    res.status(201).json(savedCourseCatalog);
  } catch (error) {
    console.error("Error creating course catalog:", error);
    res.status(500).json({ error: "Failed to create course catalog" });
  }
};

// Get all course catalog documents
exports.getAllCourseCatalogs = async (req, res) => {
  console.log(
    "Inside get Course catalog checking program id",
    req.params.programId
  );
  try {
    const courseCatalogs = await CourseCatalog.find({
      program: req.params.programId,
    })
      .populate("program")
      .populate("genUser")
      .exec();

    res.status(200).json(courseCatalogs);
  } catch (error) {
    console.error("Error fetching course catalogs:", error);
    res.status(500).json({ error: "Failed to fetch course catalogs" });
  }
};

// Get a single course catalog document by ID
// exports.getCourseCatalogById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const courseCatalog = await CourseCatalog.findById(id);
//     if (!courseCatalog) {
//       return res.status(404).json({ error: "Course catalog not found" });
//     }
//     res.status(200).json(courseCatalog);
//   } catch (error) {
//     console.error("Error fetching course catalog by ID:", error);
//     res.status(500).json({ error: "Failed to fetch course catalog" });
//   }
// };

// Update a course catalog document by ID
exports.updateCourseCatalogById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCourseCatalog = await CourseCatalog.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedCourseCatalog) {
      return res.status(404).json({ error: "Course catalog not found" });
    }
    res.status(200).json(updatedCourseCatalog);
  } catch (error) {
    console.error("Error updating course catalog:", error);
    res.status(500).json({ error: "Failed to update course catalog" });
  }
};

// Delete a course catalog document by ID
exports.deleteCourseCatalogById = async (req, res) => {
  const { CourseCatId } = req.params;
  try {
    const deletedCourseCatalog = await CourseCatalog.findByIdAndDelete(
      CourseCatId
    );
    if (!deletedCourseCatalog) {
      return res.status(404).json({ error: "Course catalog not found" });
    }
    res.status(200).json(deletedCourseCatalog);
  } catch (error) {
    console.error("Error deleting course catalog:", error);
    res.status(500).json({ error: "Failed to delete course catalog" });
  }
};

exports.fetchAllProgramsCourseCat = async (req, res) => {
  console.log("Caledddddddd");
  try {
    const { departmentId } = req.params;
    console.log("Department Id", departmentId);

    // Find all programs within the specified department
    const programs = await Program.find({ department: departmentId });

    // Array to store all course catalogs
    let allCourseCatalogs = [];

    // Iterate over each program and fetch its course catalogs
    for (const program of programs) {
      // Fetch course catalogs for the current program
      const courseCatalogs = await CourseCatalog.find({ program: program._id })
        .populate("program")
        .populate("genUser");

      // Concatenate the course catalogs to the array
      allCourseCatalogs = allCourseCatalogs.concat(courseCatalogs);
    }

    res.status(200).json(allCourseCatalogs);
  } catch (error) {
    console.error("Error fetching course catalogs of all programs:", error);
    res.status(500).json({ error: "Failed to fetch course catalogs" });
  }
};
