const mongoose = require("mongoose");
const GenUser = require("../AdminModels/GenUserModel");

// Define the schema for the model
const CourseCatalogSchema = new mongoose.Schema({
  program: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Program model
    ref: "Program", // Name of the referenced model
    required: true,
  },
  fileTitle: {
    type: String,
    required: true,
  },
  pdfFile: {
    type: String, // Assuming you store the file path or URL
    required: true,
  },
  genUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser",
    required: true,
  },
});

// Create the model using the schema
const CourseCatalog = mongoose.model("CourseCatalog", CourseCatalogSchema);

module.exports = CourseCatalog;
