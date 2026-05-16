const express = require("express");
const router = express.Router();
const multer = require("multer");
const CrtFYP = require("../../controllers/CoordinatorController/CreateFYPRegCont");
const TermContinuation = require("../../controllers/CoordinatorController/TermContinuationController");
const authMiddleware = require("../../middleware/auth");
// Define multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save uploaded files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file to include a timestamp
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Route to handle task assignment creation with file upload
router.post(
  "/CreateFYPRegistration",
  authMiddleware,
  upload.single("regRulesPdf"),
  CrtFYP.createFYPRegistration
);
router.get(
  "/GetFYPRegistrationOfTerm/:term",
  authMiddleware,
  CrtFYP.getRegistrationDeadline
);
router.get(
  "/GetAllFYPRegistrationOfTerm",
  authMiddleware,
  CrtFYP.getAllRegistrationsDeadline
);

router.patch(
  "/updateFYPRegDeadline/:registrationId",
  authMiddleware,
  CrtFYP.updateFYPRegDeadline
);

router.delete(
  "/deleteFYPRegistration/:registrationId",
  authMiddleware,
  CrtFYP.deleteFYPRegistration
);

// Route to promote approved groups from Part I to Part II
router.post(
  "/promote-to-part-ii",
  authMiddleware,
  TermContinuation.promoteGroupsToPartII
);

// Route to check if term is eligible for promotion
router.get(
  "/check-promotion-eligibility/:termId",
  authMiddleware,
  TermContinuation.checkPromotionEligibility
);

module.exports = router;
