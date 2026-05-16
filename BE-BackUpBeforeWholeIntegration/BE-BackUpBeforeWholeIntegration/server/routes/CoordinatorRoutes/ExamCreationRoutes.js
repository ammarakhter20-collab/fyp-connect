const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const examController = require("../../controllers/CoordinatorController/ExamCreationCont");

// Route to create a new exam
router.post("/create-exam", authMiddleware, examController.createExam);

// Route to get all exams
router.get("/getting-exams", authMiddleware, examController.getAllExams);
router.get("/specific/:termId", authMiddleware, examController.getSpecificExam);
router.get("/examCount", authMiddleware, examController.countCreatedExams);
router.get(
  "/getAllCreatedExam",
  authMiddleware,
  examController.getAllCreatedExams
);
router.get(
  "/getParticularExam",
  authMiddleware,
  examController.getSpecificCreatedExam
);
router.get(
  "/getParticularExamOrient",
  authMiddleware,
  examController.getSpecificCreatedExamOreient
);

router.delete(
  "/deletePartExam/:examId",
  authMiddleware,
  examController.deleteExam
);

router.patch(
  "/updateStatus/:examId",
  authMiddleware,
  examController.updateExamStatus
);

// Route to assign a CLOForExam to an exam
router.patch(
  "/assign-clo-for-exam",
  authMiddleware,
  examController.assignCLOForExam
);

module.exports = router;
