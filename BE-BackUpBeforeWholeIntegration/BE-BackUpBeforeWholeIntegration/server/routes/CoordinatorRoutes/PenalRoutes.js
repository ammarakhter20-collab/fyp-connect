const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");

const panelDetailsController = require("../../controllers/CoordinatorController/PenalController");

router.post("/create-penal", authMiddleware, async (req, res) => {
  try {
    await panelDetailsController.createPanelWithMembers(req, res);
  } catch (error) {
    console.error("Error in  route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch(
  "/assign-panel",
  authMiddleware,
  panelDetailsController.assignPanel
);

router.get(
  "/get-penal/:userId",
  authMiddleware,
  panelDetailsController.getPanelDetailsByUserId
);

router.get(
  "/get-all-panels",
  authMiddleware,
  panelDetailsController.getAllPanels
);
router.get(
  "/CheckPanelAssignedOrNot/:groupId",
  authMiddleware,
  panelDetailsController.checkPanelAssigned
);

router.get(
  "/panels/:panelId",
  authMiddleware,
  panelDetailsController.getPanelById
);
router.get(
  "/getPanelCount/:depId",
  authMiddleware,
  panelDetailsController.countExaminerPanels
);

router.get(
  "/getEvaluationStatofexminer/:termId/:examId",
  authMiddleware,
  panelDetailsController.getEvaluationStatofexminer
);

router.get(
  "/evaluationStatus/:termId/:examName?",
  authMiddleware,
  panelDetailsController.getEvaluationStatusByPanel
);

router.get(
  "/getEvaluationStatofAllexm",
  authMiddleware,
  panelDetailsController.getEvaluationStatofAllexm
);

router.delete(
  "/panels/:panelId/:memberId",
  panelDetailsController.deleteParticularPanelMember
);
router.patch("/assign-role", authMiddleware, panelDetailsController.assignRole);

router.patch(
  "/add-faculty-member",
  authMiddleware,
  panelDetailsController.addFacultyMember
);
router.patch(
  "/updatePanelData/:panelId",
  authMiddleware,
  panelDetailsController.updatePanelDetails
);

router.delete(
  "/deleteExamPanel/:panelId",
  authMiddleware,
  panelDetailsController.deletePanel
);

router.delete(
  "/panel/:panelId/facultyMember/:facultyMemberId",
  authMiddleware,
  panelDetailsController.removeFacultyMember
);

router.get(
  "/groups-for-panel-assignment",
  authMiddleware,
  panelDetailsController.getGroupsForPanelAssignment
);

router.patch(
  "/unassign-panel",
  authMiddleware,
  panelDetailsController.unassignPanel
);

module.exports = router;
