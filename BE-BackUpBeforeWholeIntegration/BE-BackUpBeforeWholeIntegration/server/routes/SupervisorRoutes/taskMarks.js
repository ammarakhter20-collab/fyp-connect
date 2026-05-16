const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const taskMarksController = require("../../controllers/SupervisorController.js/marksController");

router.get(
  "/fetchTaskMarks/:groupId/:taskId",
  authMiddleware,
  taskMarksController.fetchTaskMarks
);

module.exports = router;
