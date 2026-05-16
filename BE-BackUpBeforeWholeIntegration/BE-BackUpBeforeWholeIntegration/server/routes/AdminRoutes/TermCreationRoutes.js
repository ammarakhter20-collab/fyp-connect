const express = require("express");
const router = express.Router();
const FYPtermController = require("../../controllers/AdminCont/TermCreationCont");
const authMiddleware = require("../../middleware/auth");

// FYPterm Creation routes
router.post("/createfypterm", authMiddleware, FYPtermController.createFYPterm);

router.get("/getTermdata", authMiddleware, FYPtermController.getTermData);
router.get(
  "/getActivatedTermForStudCreatCheck",
  authMiddleware,
  FYPtermController.getActivatedTermsForCheck
);
router.put("/updateTermData", authMiddleware, FYPtermController.updateFYPterm);
router.get(
  "/findActivatedStatus",
  authMiddleware,
  FYPtermController.findActivatedStatus
);
router.put("/deactivate", authMiddleware, FYPtermController.deactivateTerm);
router.get(
  "/fetchTermCount",
  authMiddleware,
  FYPtermController.fetchFYPTermCount
);
// FYPterm Creation routes

module.exports = router;
