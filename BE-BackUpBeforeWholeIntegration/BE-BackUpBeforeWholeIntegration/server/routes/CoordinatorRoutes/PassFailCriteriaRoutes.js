const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const passFailCriteriaController = require("../../controllers/CoordinatorController/PassFailCriteriaCont");

// Route to create a new pass/fail criteria
router.post(
    "/create",
    authMiddleware,
    passFailCriteriaController.createPassFailCriteria
);

// Route to get all pass/fail criteria
router.get(
    "/getAll",
    authMiddleware,
    passFailCriteriaController.getAllPassFailCriteria
);

// Route to get pass/fail criteria by term
router.get(
    "/getByTerm/:termId",
    authMiddleware,
    passFailCriteriaController.getPassFailCriteriaByTerm
);

// Route to update pass/fail criteria
router.patch(
    "/update/:id",
    authMiddleware,
    passFailCriteriaController.updatePassFailCriteria
);

module.exports = router;
