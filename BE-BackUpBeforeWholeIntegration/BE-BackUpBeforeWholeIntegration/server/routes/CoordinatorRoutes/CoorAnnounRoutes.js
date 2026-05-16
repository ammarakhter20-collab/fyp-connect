const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const announcementController = require("../../controllers/CoordinatorController/CoorAnnounCont");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the upload destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the file name
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Create Announcement
router.post(
  "/addCoordAnnoun/:userId",
  upload.single("file"),
  announcementController.createAnnouncement
);

// Get All Announcements
router.get(
  "/getAllCoordAnnouncements",
  authMiddleware,
  announcementController.getAllAnnouncements
);
router.get(
  "/getAllAnnouncementByUploadedby/:userId",
  authMiddleware,
  announcementController.getAnnouncementByUploadedBy
);
router.get(
  "/announcementsByStatus",
  authMiddleware,
  announcementController.getAnnouncementByStatus
);

// Get Single Announcement
router.get("/:id", announcementController.getAnnouncementByStatus);

// Update Announcement
router.patch(
  "/updateAnnouncement/:announId",
  authMiddleware,
  upload.single("file"),
  announcementController.updateAnnouncement
);

// Delete Announcement
router.delete(
  "/deleteCoordAnnoun/:id",
  announcementController.deleteAnnouncement
);

module.exports = router;
