const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const results = require("../../controllers/CoordinatorController/ResultsController")



router.post(
  "/store-results",
  authMiddleware,
  results.storeStudentResults
);




router.get(
  "/getresultsbygrpId/:groupId/:userId",
  results.getResultsByGroupId
);

module.exports = router;