const express = require("express");
const router = express.Router();
const multer = require("multer");
const CourseCatController = require("../../controllers/CoordinatorController/CourseCatCont");
const authMiddleware = require("../../middleware/auth");
// Define multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save uploaded files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file to include a timestamp
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Route to handle task assignment creation with file upload
router.post(
  "/AddCourseCat",
  authMiddleware,
  upload.single("pdfFile"),
  CourseCatController.createCourseCatalog
);
router.get(
  "/fetchCourseCat/:programId",
  authMiddleware,
  CourseCatController.getAllCourseCatalogs
);
router.delete(
  "/DeleteCourseCat/:CourseCatId",
  authMiddleware,
  CourseCatController.deleteCourseCatalogById
);
router.get(
  "/fetchCourseCatOfParticularDep/:departmentId",
  authMiddleware,
  CourseCatController.fetchAllProgramsCourseCat
);

// router.patch(
//   "/SubmitTaskByStudent/:taskid",
//   authMiddleware,
//   upload.fields([
//     { name: "attachPdf", maxCount: 1 },
//     { name: "submitPdf", maxCount: 1 },
//   ]),
//   taskController.updateTaskAssignment
// );
// router.get(
//   "/getAssignTask/:id",
//   authMiddleware,
//   taskController.fetchAssignedTasks
// );

module.exports = router;
