const express = require("express");
const router = express.Router();
const TimetableController = require("../controllers/StdTimetableCont");
const authMiddleware = require("../middleware/auth");

router.post(
  "/AddStudTimetable",
  authMiddleware,
  TimetableController.storeTimetableData
);
// router.post("/", createGenUser);
