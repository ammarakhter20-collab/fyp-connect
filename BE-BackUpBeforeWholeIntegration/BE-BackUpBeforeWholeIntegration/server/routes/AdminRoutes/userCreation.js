const express = require("express");
const router = express.Router();
// const upload = require("../.");
const importStudents = require("../../controllers/AdminCont/CreationUser");
// const importFaculty = require("../../controllers/AdminCont/CreationUser");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Import the fs module

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;

router.post(
  "/uploadSheet",
  upload.single("excel"),
  importStudents.importStudent
);

router.post(
  "/uploadFacultySheet",
  upload.single("excel"),
  importStudents.importFaculty
);

module.exports = router;
