const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const examTypeController = require("../../controllers/CoordinatorController/ExamTypeCont");

// Route to create a new exam type
router.post(
  "/CreateExamType",
  authMiddleware,
  examTypeController.createExamType
);

// Route to get all exam types
router.get(
  "/GetCreatedExamType",
  authMiddleware,
  examTypeController.getAllExamTypes
);

router.patch(
  "/updateExamType/:id",
  authMiddleware,
  examTypeController.updateExamType
);

router.delete("/deleteExamType/:id", examTypeController.deleteExamType);

module.exports = router;
