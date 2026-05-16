const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const questionsForCLOController = require("../../controllers/CoordinatorController/QuesForCLOCont");

// Route to create a new question for CLO
router.post(
  "/addQuesForClo",
  authMiddleware,
  questionsForCLOController.createQuestionForCLO
);

// Route to get all questions for CLO
router.get(
  "/getAllQuestions",
  authMiddleware,
  questionsForCLOController.getAllQuestionsForCLO
);

router.patch(
  "/updateQuestion/:id",
  authMiddleware,
  questionsForCLOController.updateQuestionForCLO
);

// Route to delete a question for CLO
router.delete(
  "/deleteQuestion/:id",
  authMiddleware,
  questionsForCLOController.deleteQuestionForCLO
);

module.exports = router;
