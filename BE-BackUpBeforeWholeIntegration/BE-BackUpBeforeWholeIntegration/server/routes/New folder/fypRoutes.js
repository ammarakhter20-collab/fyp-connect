const express = require("express");
const router = express.Router();
const fypRegController = require("../controllers/StudentCont/fypRegController");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const TimetableController = require("../controllers/StudentCont/StdTimetableCont");
const TechReqController = require("../controllers/StudentCont/TechReqCont");
const TopicReqController = require("../controllers/StudentCont/TopicReq");
const FYPAttendanceController = require("../../server/controllers/SupervisorController.js/FYPAttendanceController");
const FYPGroup = require("../models/StudentModels/fypRegModel");
const FYPGroupAttendance = require("../../server/models/SupervisorModels/FYPAttendanceModel");

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination folder where the uploaded files will be stored
    cb(null, "uploads/"); // You should create the 'uploads' folder in your project directory
  },
  filename: function (req, file, cb) {
    // Define the file name for the uploaded file
    const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
console.log(storage);
console.log("I am in fypp routes");

// Example route for FYP registration with file upload
router.post(
  "/Registration",
  upload.single("selectedFile"),
  async (req, res) => {
    try {
      console.log("Here i am");
      await fypRegController.createReg(req, res);
    } catch (error) {
      console.error("Error in file upload route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
router.patch("/updregistration", fypRegController.updateReg);
router.patch(
  "/updProjByCoord",
  authMiddleware,
  fypRegController.updateProjByCoord
);

router.get("/fypdata", authMiddleware, async (req, res) => {
  try {
    // Forward the request to the controller and send the response

    await fypRegController.getFypData(req, res);
  } catch (error) {
    console.error("Error in getFypData route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/getAllfypdata", authMiddleware, async (req, res) => {
  try {
    // Forward the request to the controller and send the response

    await fypRegController.getAllFypReg(req, res);
  } catch (error) {
    console.error("Error in getAllFypData route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/addStudentInGroup", authMiddleware, fypRegController.addMember);
router.delete(
  "/deleteStudentInGroup",
  authMiddleware,
  fypRegController.deleteMemberOfGroup
);

//Student Timetable Routes
router.post(
  "/AddStudTimetable",
  authMiddleware,
  TimetableController.storeTimetableData
);
router.get(
  "/FetchStudTimetable",
  authMiddleware,
  TimetableController.getTimetableData
);
router.patch(
  "/UpdateStudTimetable",
  authMiddleware,
  TimetableController.updateTimetableData
);
//Student Timetable Routes

router.post(
  "/AddSupTimetable",
  authMiddleware,
  TimetableController.storeTimetableData
);
// router.get(
//   "/FetchStudTimetable",
//   authMiddleware,
//   TimetableController.getTimetableData
// );

router.get(
  "/checkingUser",
  authMiddleware,
  fypRegController.CheckFypStudentExistWhoFillForm
);

// Technology Change Request Routes
router.post(
  "/ChangeTechRequest",
  authMiddleware,
  TechReqController.createFYPTechnologyChangeRequest
);
router.patch(
  "/UpdateTechRequest/:id",
  authMiddleware,
  TechReqController.updateTechnologyRequest
);
// router.get(
//   "/fypTechnologyReq/:id",
//   authMiddleware,
//   TechReqController.getFYPTechnologyReqByGroupId
// );

router.get(
  "/fypTechnologyReq/:id",
  authMiddleware,
  TechReqController.getFYPTechnologyReqByGroupId
);

// router.get(
//   "/fypTechnologyReq/:groupId",
//   authMiddleware,
//   TechReqController.getFYPTechnologyReqByGroupId
// );

// Technology Change Request Routes

// Topic Change Routes
router.post(
  "/ChangeTopicRequest",
  authMiddleware,
  TopicReqController.createFYPTopicChangeRequest
);

router.get(
  "/fypTopicReq/:id",
  authMiddleware,
  TopicReqController.getFYPTopicReqByGroupId
);

router.patch(
  "/UpdateTopicRequest/:id",
  authMiddleware,
  TopicReqController.updateTopicRequest
);
// Topic Change Routes

// Attendance Routes
// router.post("/mark-fyp-group-attendance", authMiddleware, async (req, res) => {
//   const { meetingNo, date, startTime, endTime, attendanceStatus, fypTitle } =
//     req.body;

//   // Find the FYPGroup document by title
//   const fypGroup = await FYPGroup.findOne({ title: fypTitle });
//   if (!fypGroup) {
//     return res.status(400).json({ message: "FYPGroup not found" });
//   }

//   // Update attendance status for each group member
//   const memberAttendances = [];
//   for (let registrationNo in attendanceStatus) {
//     const member = fypGroup.groupMembers.find(
//       (member) => member.registrationNumber === registrationNo
//     );
//     if (member) {
//       memberAttendances.push({
//         member: member._id,
//         status: attendanceStatus[registrationNo].attendance,
//       });
//     }
//   }

//   // Create FYPGroupAttendance document
//   const fypGroupAttendance = new FYPGroupAttendance({
//     meetingNo,
//     meetingDate: new Date(date),
//     meetingStartTime: new Date(startTime),
//     meetingEndTime: new Date(endTime),
//     memberAttendances,
//     fypgroup: fypGroup._id,
//   });

//   try {
//     await fypGroupAttendance.save();
//     res.status(201).json(fypGroupAttendance);
//   } catch (error) {
//     console.error("Error in MarkFYPAttendance route:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.get("/get-fyp-group-attendance", authMiddleware, async (req, res) => {
//   try {
//     // Forward the request to the controller and send the response

//     await FYPAttendanceController.getAttendance(req, res);
//   } catch (error) {
//     console.error("Error in getFYPAttendance route:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Attendance Routes

router.get("/fyprequests/:userid?", async (req, res) => {
  try {
    // Forward the request to the controller and send the response

    await fypRegController.getFypRegistrationReq(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getfypregistrations/:userid?", async (req, res) => {
  try {
    // Forward the request to the controller and send the response

    await fypRegController.getRegisteredFyps(req, res);
  } catch (error) {
    console.error("Error in FYP Registration  route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/getfypregistrationsbyGroupId/:groupId?", async (req, res) => {
  try {
    // Forward the request to the controller and send the response

    await fypRegController.getfypregistrationsbyGroupId(req, res);
  } catch (error) {
    console.error("Error in FYP Registration  route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/updatestatus/:requestid", async (req, res) => {
  try {
    await fypRegController.updateFypRequestStatus(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get(
  "/fyp-change-requests/:userid",
  //authMiddleware,
  async (req, res) => {
    try {
      // Forward the request to the controller and send the response

      await fypRegController.getFYPChangeRequestDetails(req, res);
    } catch (error) {
      console.error("Error in FYP Change Req route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
