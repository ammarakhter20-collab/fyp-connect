const express = require("express");
const router = express.Router();
const FYPAttendanceController = require("../../controllers/SupervisorController.js/FYPAttendanceController");
const FYPGroup = require("../../models/StudentModels/fypRegModel");
const FYPGroupAttendance = require("../../models/SupervisorModels/FYPAttendanceModel"); // Adjust the path as needed

const authMiddleware = require("../../middleware/auth");

console.log("I am in fyppAttendance routes");

router.post("/mark-fyp-group-attendance", authMiddleware, async (req, res) => {
  const { meetingNo, date, startTime, endTime, attendanceStatus, fypTitle } =
    req.body;

  // Find the FYPGroup document by title
  const fypGroup = await FYPGroup.findOne({ title: fypTitle });
  if (!fypGroup) {
    return res.status(400).json({ message: "FYPGroup not found" });
  }

  // Update attendance status for each group member
  const memberAttendances = [];
  for (let registrationNo in attendanceStatus) {
    const member = fypGroup.groupMembers.find(
      (member) => member.registrationNumber === registrationNo
    );
    if (member) {
      memberAttendances.push({
        member: member._id,
        status: attendanceStatus[registrationNo].attendance,
      });
    }
  }

  // Create FYPGroupAttendance document
  const fypGroupAttendance = new FYPGroupAttendance({
    meetingNo,
    meetingDate: new Date(date),
    meetingStartTime: new Date(startTime),
    meetingEndTime: new Date(endTime),
    memberAttendances,
    fypgroup: fypGroup._id,
  });

  try {
    await fypGroupAttendance.save();
    res.status(201).json(fypGroupAttendance);
  } catch (error) {
    console.error("Error in MarkFYPAttendance route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-fyp-group-attendance", authMiddleware, async (req, res) => {
  try {
    // Forward the request to the controller and send the response

    await FYPAttendanceController.getAttendance(req, res);
  } catch (error) {
    console.error("Error in getFYPAttendance route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getParticularGrpAtt/:id",
  // authMiddleware, 
  async (req, res) => {
    try {
      // Forward the request to the controller and send the response

      await FYPAttendanceController.getAttendanceUnderSupervision(req, res);
    } catch (error) {
      console.error("Error in getFYPAttendance route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
