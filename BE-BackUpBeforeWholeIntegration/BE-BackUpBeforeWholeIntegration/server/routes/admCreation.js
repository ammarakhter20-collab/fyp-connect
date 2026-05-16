const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const FYPtermController = require("../controllers/AdmCreationController");
const DepartmentController = require("../controllers/AdmCreationController");
const ProgramController = require("../controllers/AdmCreationController");

// FYPterm Creation route
// router.post("/createfypterm", FYPtermController.createFYPterm);

// Department Creation route
router.post(
  "/create-department",
  authMiddleware,
  DepartmentController.createDepartment
);

// Program Creation route
router.post("/create-program", authMiddleware, ProgramController.createProgram);

// Other routes (login, signup, user-data, etc.) remain unchanged

module.exports = router;
