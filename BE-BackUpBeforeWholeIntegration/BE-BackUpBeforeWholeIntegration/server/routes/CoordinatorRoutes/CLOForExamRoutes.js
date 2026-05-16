const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const cloController = require("../../controllers/CoordinatorController/CLOForExamCont");

// Route to create a new CLOForExam document
router.post(
  "/createCLOForExam",
  authMiddleware,
  cloController.createCLOForExam
);
router.post(
  "/removeAssignedCLO",
  authMiddleware,
  cloController.removeCLOFromExam
);

// Route to delete a CLOForExam document
router.delete(
  "/deleteCLOForExam/:id",
  authMiddleware,
  cloController.deleteExamCLO
);

router.get(
  "/gettingAllClOForExam",
  authMiddleware,
  cloController.getAllCLOForExam
);

// Route to get a particular CLO for exam by ID
router.get(
  "/gettingParticularCLOForExam/:id",
  cloController.getParticularCLOForExam
);

// Route to add CLOs to a CLOForExam document
router.patch("/add-clos-In-Exam", authMiddleware, cloController.addCLOsToExam);

module.exports = router;
