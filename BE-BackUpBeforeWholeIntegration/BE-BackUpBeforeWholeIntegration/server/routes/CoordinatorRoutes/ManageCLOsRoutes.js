const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const cloController = require("../../controllers/CoordinatorController/ManageCLOsCont");

// Route to create a new CLO
router.post("/CreateCLO", authMiddleware, cloController.createCLO);
router.post(
  "/removeQuestionInsideCLO",
  authMiddleware,
  cloController.removeQuestionFromCLO
);

// Route to get all CLOs
router.get("/getAllClos", authMiddleware, cloController.getAllCLOs);
router.get(
  "/getParticularClo/:id",
  authMiddleware,
  cloController.getParticularCLO
);

// Route to update a CLO
router.patch("/updateClo/:id", authMiddleware, cloController.updateCLO);

// Route to delete a CLO
router.delete("/deleteClo/:id", authMiddleware, cloController.deleteCLO);

// Route to assign questions to a CLO
router.patch(
  "/assign-questions",
  authMiddleware,
  cloController.assignQuestionToCLO
);

router.patch(
  "/delete-question-InCLo",
  authMiddleware,
  cloController.delQuesInClo
);

module.exports = router;
