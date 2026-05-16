const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const SupervisorController = require("../../controllers/SupervisorController.js/Topic");
const FeedbackController = require("../../controllers/SupervisorController.js/FeedbackCont");

// Route to add a new topic

router.post("/topics", authMiddleware, SupervisorController.addTopic);
router.get("/Fetchtopics", authMiddleware, SupervisorController.fetchTopics);
// Route to add a new topic

// FeedbackRoutes
router.post("/giveFeedback", authMiddleware, FeedbackController.createFeedback);
router.get("/fetchFeedback", authMiddleware, FeedbackController.fetchFeedback);
router.delete(
  "/deleteFeedback/:groupId",
  authMiddleware,
  FeedbackController.deleteFeedbackOfGroup
);

module.exports = router;
