const express = require("express");
const path = require("path");

const router = express.Router();

// Serve static files from the "uploads" directory
router.use(express.static(path.join(__dirname, "uploads")));

// Middleware to set content type based on file extension
router.use((req, res, next) => {
  const filePath = path.join(__dirname, "uploads", req.url);
  const ext = path.extname(filePath).toLowerCase();

  // Set the appropriate content type based on the file extension
  if (ext === ".pdf") {
    res.contentType("application/pdf");
  } else if (ext === ".doc" || ext === ".docx") {
    res.contentType("application/msword");
  }

  next();
});

module.exports = router;
