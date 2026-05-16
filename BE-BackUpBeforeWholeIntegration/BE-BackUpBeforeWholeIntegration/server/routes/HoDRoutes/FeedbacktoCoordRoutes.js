const express = require("express");
const router = express.Router();
const feedbackController = require("../../controllers/HoDCont/FeedbackToCoord");
const authMiddleware = require("../../middleware/auth");

// POST route to create new feedback
router.post(
  "/feedbacktoCoord",
  authMiddleware,
  feedbackController.createFeedback
);
router.get(
  "/getfeedbackstoCoord/:departmentId",
  authMiddleware,
  feedbackController.fetchFeedbacks
);

module.exports = router;
