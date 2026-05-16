const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const examScheduleController = require("../../controllers/CoordinatorController/ExamScheduleCont");

// Route for fetching scheduled exams with panel details populated
router.get(
  "/getting-scheduled-exams",
  authMiddleware,
  examScheduleController.getScheduledExams
);
// router.get(
//   "/getting-scheduled-exams",
//   authMiddleware,
//   examScheduleController.getScheduledExams
// );

router.get(
  "/scheduled/specific/:panelId",
  authMiddleware,
  examScheduleController.getSpecificScheduledExam
);
router.get(
  "/scheduled/specific/:role",
  authMiddleware,
  examScheduleController.getSpecificScheduledExam11
);
router.get(
  "/getExamsOfFaculty",
  authMiddleware,
  examScheduleController.getExamsForFaculty
);

router.get(
  "/scheduled/specificexam/:role/:termId",
  authMiddleware,
  examScheduleController.getSpecificScheduledExam11
);

router.post(
  "/createExamSchedule",
  authMiddleware,
  examScheduleController.createExamSchedule
);

router.delete(
  "/delete/:id",
  authMiddleware,
  examScheduleController.deleteExamSchedule
);

module.exports = router;
