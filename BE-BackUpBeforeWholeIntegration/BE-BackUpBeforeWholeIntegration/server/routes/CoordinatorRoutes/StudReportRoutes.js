const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path"); // Import the path module
const authMiddleware = require("../../middleware/auth");
const StudReportController = require("../../controllers/CoordinatorController/StudentReportsCont");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination directory for uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

router.post(
  "/UploadStudReport",
  authMiddleware,
  upload.single("submitReportPdf"), // single file upload handler
  StudReportController.uploadStudentReport
);
router.put(
  "/UpdateStudReport",
  authMiddleware,
  upload.single("submitReportPdf"), // single file upload handler
  StudReportController.updateStudentReport
);
router.get(
  "/gettingGroupReports/:groupId",
  authMiddleware,
  StudReportController.fetchedReportsByGroupId
);

router.get(
  "/reports/check/:groupId/:examId",
  authMiddleware,
  StudReportController.checkReportExistEndpoint
);
router.patch(
  "/update-status/:reportId",
  authMiddleware,
  StudReportController.updateReportStatus
);

router.get(
  "/panel-reports/:panelId",
  authMiddleware,
  StudReportController.fetchApprovedReportsForPanel
);

module.exports = router;
