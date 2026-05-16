const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const CoordinatorController = require("../../controllers/CoordinatorController/TechnologyCont");
const CoordinatorPlatController = require("../../controllers/CoordinatorController/PlatformCont");

// Route to add a new topic

// Technology Routes start
router.post(
  "/addtechnology",
  authMiddleware,
  CoordinatorController.addTechnology
);
router.get(
  "/fetchtechnology",
  authMiddleware,
  CoordinatorController.fetchTechnologies
);
router.patch(
  "/updTechnology/:id",
  authMiddleware,
  CoordinatorController.updateTech
);
router.delete(
  "/delTechnology/:id",
  authMiddleware,
  CoordinatorController.deleteTech
);
// Technology Routes end

// Platoform Routes start
router.post(
  "/addplatform",
  authMiddleware,
  CoordinatorPlatController.addPlatform
);
router.get(
  "/fetchplatform",
  authMiddleware,
  CoordinatorPlatController.fetchPlatforms
);
router.patch(
  "/EditPlatform/:platformId",
  authMiddleware,
  CoordinatorPlatController.updatePlatform
);
router.delete(
  "/DelPlatForm/:platformId",
  authMiddleware,
  CoordinatorPlatController.deletePlatform
);

module.exports = router;
