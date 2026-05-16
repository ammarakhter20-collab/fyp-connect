const express = require("express");
const router = express.Router();
const multer = require("multer");
const taskController = require("../../controllers/SupervisorController.js/TaskAssignmentCont");
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
  "/AssignTask",
  authMiddleware,
  upload.single("attachPdf"),
  taskController.createTaskAssignment
);

router.patch(
  "/SubmitTaskByStudent/:taskid",
  authMiddleware,
  upload.fields([
    { name: "attachPdf", maxCount: 1 },
    { name: "submitPdf", maxCount: 1 },
  ]),
  taskController.updateTaskAssignment
);
router.get(
  "/getAssignTask/:id",
  authMiddleware,
  taskController.fetchAssignedTasks
);

//ROUTES FOR TASKS//////////////////////////////////////////////

router.patch("/update-task/:userid", authMiddleware, async (req, res) => {
  try {
    await taskController.updateTask(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/upload-task/:userid",
  authMiddleware,
  upload.array("attachPdf", 1),
  async (req, res) => {
    try {
      await taskController.createTaskAssignment(req, res);
    } catch (error) {
      console.error("Error in upload-task route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/get-tasks/:userid?", async (req, res) => {
  try {
    await taskController.getTasks(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//ROUTES FOR TASKS//////////////////////////////////////////////

module.exports = router;
