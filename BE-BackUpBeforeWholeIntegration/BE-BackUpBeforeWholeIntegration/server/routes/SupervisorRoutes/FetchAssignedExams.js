const express = require("express");
const router = express.Router();
const FYPGroup = require("../../models/StudentModels/fypRegModel");
const PanelDetails = require("../../models/CoordinatorModels/PenalModel");
const CreatedExam = require("../../models/CoordinatorModels/ExamScheduleModel");
const ExamDetails = require("../../controllers/SupervisorController.js/FetchAssignedExams");
const authMiddleware = require("../../middleware/auth");

router.get(
  "/fyp-Assigned-Exams/:userId",
  authMiddleware,
  ExamDetails.getFypRegistrationsByPanelMember
);
module.exports = router;
