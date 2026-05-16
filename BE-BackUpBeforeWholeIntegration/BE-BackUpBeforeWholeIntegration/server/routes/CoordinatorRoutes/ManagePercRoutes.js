const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const supervisorPercentageController = require("../../controllers/CoordinatorController/ManagePercentageCont");

// Route to create a new supervisor percentage
router.post(
  "/AddSupPercentage",
  authMiddleware,
  supervisorPercentageController.createSupervisorPercentage
);

// Route to get all supervisor percentages
router.get(
  "/getSupPercentage",
  authMiddleware,
  supervisorPercentageController.getAllSupervisorPercentages
);

router.patch(
  "/updateSupPerc/:id",
  authMiddleware,
  supervisorPercentageController.updateSupPercentage
);

module.exports = router;
