const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");

const ExamAssignmentController = require("../../controllers/CoordinatorController/ExamAssignmentController");

router.post("/create-exam", authMiddleware, async (req, res) => {
  try {
    await ExamAssignmentController.createExamAssignment(req, res);
  } catch (error) {
    console.error("Error in  route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get(
  "/get-exam/:userid?",
  //authMiddleware,
  async (req, res) => {
    try {
      await ExamAssignmentController.getExamAssignments(req, res);
    } catch (error) {
      console.error("Error in  route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
router.get(
  "/get-exam-by-part/:userid?",
  //authMiddleware,
  async (req, res) => {
    try {
      await ExamAssignmentController.getExamAssignmentsByPartStatus(req, res);
    } catch (error) {
      console.error("Error in  route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/get-approved-exam/:userid?",
  //authMiddleware,
  async (req, res) => {
    try {
      await ExamAssignmentController.getApprovedExamReports(req, res);
    } catch (error) {
      console.error("Error in  route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/get-exam-reports/:userid?",
  //authMiddleware,
  async (req, res) => {
    try {
      await ExamAssignmentController.getExamReportsAsExaminer(req, res);
    } catch (error) {
      console.error("Error in  route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.patch(
  "/update-report",
  // authMiddleware,
  async (req, res) => {
    try {
      await ExamAssignmentController.updateReportStatus(req, res);
    } catch (error) {
      console.error("Error in  route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/get-group-exams/:groupId?",
  //authMiddleware,
  async (req, res) => {
    try {
      await ExamAssignmentController.getExamAssignmentsByGroupId(req, res);
    } catch (error) {
      console.error("Error in  route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
