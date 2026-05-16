const express = require("express");
const router = express.Router();
const multer = require("multer");
// const { createUser } = require("../controllers/userController");
const userController = require("../controllers/StudentCont/userController");
const GenUserController = require("../controllers/AdminCont/GenUserController");
const authMiddleware = require("../middleware/auth");
const FYPtermController = require("../controllers/AdminCont/AdmCreationController");
const DepartmentController = require("../controllers/AdminCont/AdmDepartmentCreation");
const ProgramController = require("../controllers/AdminCont/AdmProgramCreation");
const SupervisorController = require("../controllers/SupervisorController.js/Topic");
const GenUser = require("../models/AdminModels/GenUserModel");
const AnnouncementController = require("../controllers/SupervisorController.js/AnnouncementCont");
const FYPAttendanceController = require("../controllers/SupervisorController.js/FYPAttendanceController");
const ExamMarksController = require("../controllers/SupervisorController.js/examMarksController");
const panelDetailsController = require("../controllers/CoordinatorController/PenalController");
const MarksController = require("../controllers/SupervisorController.js/marksController");
const TopicController = require("../controllers/SupervisorController.js/OfferTopicController");
const CourseCatCont = require("../controllers/CoordinatorController/CourseCatCont");
const FindSupervisor = require("../controllers/StudentCont/FindSupervisorByIdCont");
const path = require("path");
const fs = require("fs"); // Import the fs module

// FYPterm Creation routes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination directory for uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// POST endpoint to handle file upload
router.post(
  "/uploadProfilePicture",
  upload.single("profileImage"),
  async (req, res) => {
    console.log("Inside upload picture");
    try {
      console.log("request", req.user);
      console.log("request", req.file);
      // Check if req.file is present and not undefined
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      // Assuming 'profileImage' is the name attribute of your file input field
      const profileImage = req.file.filename; // This will give you the filename of the uploaded image

      // Assuming you have a user ID available in the request body or session
      const { user } = req.body; // Destructure user from req.body
      console.log("User Id", user);

      // Update the user's profile image in the database
      const updatedUser = await GenUser.findByIdAndUpdate(
        user,
        { image: profileImage }, // Update the 'image' field with the filename
        { new: true } // Return the updated document
      );

      res.status(200).json({
        message: "Profile picture uploaded successfully.",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ error: "Profile picture upload failed." });
    }
  }
);

router.patch(
  "/updateProfilePicture/:userId",
  upload.single("profileImage"),
  async (req, res) => {
    console.log("Inside update profile picture");
    try {
      console.log("Request", req.params.userId);
      console.log("Request", req.file);

      // Check if req.file is present and not undefined
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      // Get the user ID from the request parameters
      const userId = req.params.userId;

      // Retrieve the previous image filename from the user document
      const user = await GenUser.findById(userId);
      const previousImage = user.image;
      console.log("Previous image", previousImage);

      // If the user had a previous image, delete it from the uploads directory
      if (previousImage) {
        // const filePath = path.join(__dirname, "../uploads", previousImage);
        const filePath = path.join("uploads", previousImage);
        console.log("filePath", filePath);
        // Check if the file exists before attempting to delete it
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Delete the previous image file
          console.log(
            `Previous image '${previousImage}' deleted successfully.`
          );
        } else {
          console.log(`Previous image '${previousImage}' does not exist.`);
        }
      }

      // Assuming 'profileImage' is the name attribute of your file input field
      const profileImage = req.file.filename; // This will give you the filename of the uploaded image

      // Update the user's profile image in the database
      const updatedUser = await GenUser.findByIdAndUpdate(
        userId,
        { image: profileImage }, // Update the 'image' field with the new filename
        { new: true } // Return the updated document
      );

      res.status(200).json({
        message: "Profile picture updated successfully.",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ error: "Profile picture update failed." });
    }
  }
);

// router.get("/profilePicture/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     console.log("Checking user Id", userId);

//     // Fetch the user from the database
//     const user = await GenUser.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     // Check if the user has an image
//     if (!user.image) {
//       return res
//         .status(404)
//         .json({ error: "Profile picture not found for this user." });
//     }

//     // Assuming you're storing the profile images in a directory called 'uploads'
//     const imagePath = path.join(__dirname, "../uploads", user.image);
//     console.log("Image path", imagePath);

//     // Send the image file as a response
//     res.sendFile(imagePath);
//   } catch (error) {
//     console.error("Error fetching profile picture:", error);
//     res.status(500).json({ error: "Failed to fetch profile picture." });
//   }
// });

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

// Department Creation Routes
router.post(
  "/createDepartment",
  authMiddleware,
  DepartmentController.createDepartment
);
router.get(
  "/fetchActivatedTermId",
  authMiddleware,
  DepartmentController.findActivatedTermId
);
router.get(
  "/fetchDepartmentData",
  authMiddleware,
  DepartmentController.getDepartmentData
);
router.get(
  "/fetchDepartmentCount",
  authMiddleware,
  DepartmentController.fetchDepartmentCount
);
router.put(
  "/updateDepartmentData",
  authMiddleware,
  DepartmentController.updateDepartmentData
);

router.delete(
  "/deleteDepartment/:id",
  authMiddleware,
  DepartmentController.deleteDepartment
);
// Department Creation Routes

// Program Creation Routes
router.post("/createProgram", authMiddleware, ProgramController.createProgram);
router.get(
  "/fetchProgramData",
  authMiddleware,
  ProgramController.getProgramsData
);
router.get(
  "/fetchDepartmentData",
  authMiddleware,
  ProgramController.getDepartmentsData
);
router.put(
  "/updateProgramData",
  authMiddleware,
  ProgramController.updateProgramData
);
router.delete(
  "/deleteProgram",
  authMiddleware,
  ProgramController.deleteProgram
);
// Program Creation Routes

// Student and Faculty(HoD, Coordinator, Supervisor) routes
router.post("/usercreation", GenUserController.createGenUser);
router.get(
  "/getCoordinatorId",
  authMiddleware,
  GenUserController.fetchCoordinatorIds
);
router.get(
  "/getStudOfTermAndProgram",
  authMiddleware,
  GenUserController.getAllStudentsOfTermAndProgram
);
router.get(
  "/getFacultyOfProgram",
  authMiddleware,
  GenUserController.fetchFacultyOfProgram
);
router.get(
  "/fetchDepartments/:id",
  authMiddleware,
  DepartmentController.getDepartmentOnId
);
router.get(
  "/fetchStudentData",
  authMiddleware,
  GenUserController.fetchStudentsData
);
router.get(
  "/CheckStudExistInOtherActTerm",
  authMiddleware,
  GenUserController.CheckStudentExistInOtherActTerm
);
router.put(
  "/updateStudentData",
  authMiddleware,
  GenUserController.updateStudentData
);
router.patch(
  "/updateUserProfile",
  authMiddleware,
  GenUserController.updateUserProfile
);

router.delete(
  "/deleteStudent",
  authMiddleware,
  GenUserController.deleteStudent
);

// router.get(
//   "/fetchFacultyData",
//   authMiddleware,
//   GenUserController.fetchFacultyData
// );
router.get(
  "/fetchFacultyData/:userid?",
  //authMiddleware,
  GenUserController.fetchFacultyData
);

router.put(
  "/updateFacultyData",
  authMiddleware,
  GenUserController.updateFacultyData
);

router.delete(
  "/deleteFacultyData",
  authMiddleware,
  GenUserController.deleteFaculty
);

router.get("/fetchAdmnData", authMiddleware, GenUserController.fetchAdminData);
router.get(
  "/fetchStudCount",
  authMiddleware,
  GenUserController.fetchStudentCount
);

router.get(
  "/fetchProgCount",
  authMiddleware,
  ProgramController.fetchProgramCount
);

// Announcement Routes
router.post(
  "/add-announcement/:userid?",
  authMiddleware,
  upload.single("filePath"),
  AnnouncementController.createAnnouncement
);

router.get(
  "/get-announcement/:userid?",
  authMiddleware,
  AnnouncementController.getAnnouncement
);
router.get(
  "/get-supannouncement/:userid?",
  authMiddleware,
  AnnouncementController.getAnnouncement11
);
router.get(
  "/getPartAnnouncement/:partstatus/:supervisorId/:coordinatorId",
  authMiddleware,
  AnnouncementController.getAnnouncementByPartStatus
);

router.patch("/update-announcement/:userid", async (req, res) => {
  try {
    await AnnouncementController.updateAnnouncement(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Announcement Routes

// Student and Faculty(HoD, Coordinator, Supervisor) routes

// Login route
router.post("/login", userController.loginUser);

router.post("/Genlogin", GenUserController.loginGenUser);
// router.post("/", createUser);
router.post("/signup", userController.createUser);

router.post("/check", (req, res) => {
  return res.json({ status: "pending" });
});
router.get("/user-data", authMiddleware, userController.getUserData);
router.get("/GenUserData", authMiddleware, GenUserController.getGenUserData);
router.get("/testdata", authMiddleware, userController.testUser);

//ROUTES FOR ANNOUNCEMNETS//////////////////////////////////////////////

//ROUTES FOR MARKS//////////////////////////////////////////////

router.patch("/update-marks/:userid", authMiddleware, async (req, res) => {
  try {
    await MarksController.updateMarks(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/upload-marks", authMiddleware, async (req, res) => {
  console.log();
  try {
    await MarksController.assignMarks(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-marks/:stdid?", async (req, res) => {
  try {
    await MarksController.getMarks(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-group-marks/:groupId", async (req, res) => {
  try {
    await MarksController.getGroupMarks(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//ROUTES FOR MARKS//////////////////////////////////////////////

//ROUTES FOR ANNOUNCEMENTS//////////////////////////////////////////////

router.post(
  "/add-announcement/:userid?",
  //  authMiddleware,
  upload.array("filePath", 1),
  AnnouncementController.createAnnouncement
);

router.get(
  "/get-announcement/:userid?",
  //  authMiddleware,
  AnnouncementController.getAnnouncement
);

router.patch(
  "/update-announcement/:userid",
  //authMiddleware,
  upload.array("filePath", 1),
  async (req, res) => {
    try {
      await AnnouncementController.updateAnnouncement(req, res);
    } catch (error) {
      console.error("Error in getFypRequest route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//ROUTES FOR ANNOUNCEMNETS//////////////////////////////////////////////

//ROUTES FOR ATTENDANCE//////////////////////////////////////////////
router.post(
  "/mark-attendance",
  //authMiddleware,
  FYPAttendanceController.createAttendance
);

router.get(
  "/get-attendance",
  authMiddleware,
  FYPAttendanceController.getAttendance
);

router.get(
  "/get-group-attendance/:userid?",
  //  authMiddleware,
  FYPAttendanceController.getAttendanceUnderSupervision
);
//ROUTES FOR ATTENDANCE//////////////////////////////////////////////

//ROUTES FOR EXAM MARKS//////////////////////////////////////////////
router.patch("/upload-exam-marks", authMiddleware, async (req, res) => {
  console.log();
  try {
    await ExamMarksController.updateExamMarks(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-exam-marks", async (req, res) => {
  try {
    await ExamMarksController.getMarksByPartStatusAndGroupId(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//ROUTES FOR EXAM MARKS//////////////////////////////////////////////

//ROUTES FOR TOPICS//////////////////////////////////////////////

router.patch("/update-topic", authMiddleware, async (req, res) => {
  try {
    await TopicController.updateTopic(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/upload-topic", authMiddleware, async (req, res) => {
  console.log();
  try {
    await TopicController.createTopic(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-topics/:userid?", async (req, res) => {
  try {
    await TopicController.getAllTopics(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/getAllTheTopics", async (req, res) => {
  try {
    await TopicController.getAllofFeredTopics(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/getAllTheTopicsOfDep", async (req, res) => {
  try {
    await TopicController.getAllofFeredTopicsByDep(req, res);
  } catch (error) {
    console.error("Error in getFypRequest route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.delete("/delete-topic", async (req, res) => {
  try {
    await TopicController.deleteTopic(req, res);
  } catch (error) {
    console.error("Error in delete  route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//ROUTES FOR TOPICS//////////////////////////////////////////////

router.get(
  "/getDetailsOfPanel/:id",
  authMiddleware,
  panelDetailsController.getPanelById
);

//CoursCatROutes
router.post(
  "/CourseCatCreate",
  authMiddleware,
  CourseCatCont.createCourseCatalog
);

//CoursCatROutes

// Get SupervisorName and Email By Id
router.get("/supervisors/:id", FindSupervisor.getSupervisorById);
// Get SupervisorName and Email By Id

module.exports = router;
