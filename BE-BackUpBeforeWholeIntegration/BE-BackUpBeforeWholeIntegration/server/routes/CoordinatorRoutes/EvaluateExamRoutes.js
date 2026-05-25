const express = require("express");
const router = express.Router();
const evaluationController = require("../../controllers/CoordinatorController/EvaluateExamCont"); // Adjust the path as necessarcy
const reportController = require("../../controllers/CoordinatorController/ReportGenerationController");
const authMiddleware = require("../../middleware/auth");

// Route to create an evaluation
router.get(
  "/evaluations/:groupId",
  authMiddleware,
  evaluationController.getEvaluationMarks
);

// Route to add marks for a specific FYPGroup
router.post(
  "/evaluations/:groupId",
  authMiddleware,
  evaluationController.addEvaluationMarks
);

router.get(
  "/evaluations/:termId/:examName",
  authMiddleware,
  evaluationController.fetchStudentMarksByTermAndExamName
);

router.get(
  "/getExamEvaluations/:termId/:examName",
  authMiddleware,
  evaluationController.getExamEvaluationDetailsbyTermAndExam
);
router.get(
  "/getExamEvaluationsbyTerm/:termId",
  //authMiddleware,
  evaluationController.getExamEvaluationDetailsbyTerm
);

router.post(
  "/AddOrientationMarks",
  authMiddleware,
  evaluationController.addOrientationMarks
);

router.get(
  "/getExamMarks/:termId",
  // authMiddleware,
  evaluationController.fetchAllExamOfGroup
);

// ============================================================================
// NEW REPORT GENERATION ROUTES
// ============================================================================

// Generate Portal Report (supports ?partStatus= query param)
router.get(
  "/portal-report/:termId",
  authMiddleware,
  reportController.generatePortalReport
);


// Generate Overall FYP Result (supports ?partStatus= query param)
router.get(
  "/overall-fyp-result/:termId",
  authMiddleware,
  reportController.generateOverallFYPResult
);

// Check if the current term has any Part II students (indicating promotion happened)
router.get(
  "/check-part-ii-status/:termId",
  authMiddleware,
  reportController.checkPartIIStatus
);

// Generate Project-Wise Report
router.get(
  "/project-wise-report/:termId",
  authMiddleware,
  reportController.generateProjectWiseReport
);

// ============================================================================
// STUDENT: Personal Overall Report (locked until all exams Completed + 100% wt)
// ============================================================================
router.get(
  "/student-overall-report/:termId/:studentId",
  authMiddleware,
  reportController.getStudentOverallReport
);

// ============================================================================
// COORDINATOR: Active Exams with Panel Member Marks
// ============================================================================

// Get all active (non-expired) exams with per-examiner marks breakdown
router.get(
  "/active-exams-with-marks",
  authMiddleware,
  evaluationController.getActiveExamsWithMarks
);

// Coordinator edits a specific examiner's marks for a student
router.put(
  "/update-examiner-marks",
  authMiddleware,
  evaluationController.updateExaminerMarksByCoordinator
);

// ============================================================================
// PANEL MEMBER: Fetch own marks for a specific exam + group
// ============================================================================

// Get a specific examiner's marks for a group (for pre-filling the edit form)
router.get(
  "/examiner-marks",
  authMiddleware,
  evaluationController.getExaminerMarksForGroup
);

module.exports = router;

