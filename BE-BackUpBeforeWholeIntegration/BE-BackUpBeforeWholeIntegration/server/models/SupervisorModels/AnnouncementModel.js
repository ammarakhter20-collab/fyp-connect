const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define a schema for the document
const announcementSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  announcement: {
    type: String,
    required: true,
  },
  forPart: {
    type: String,
    enum: ["part-I", "part-II", "all"],
    default: "all",
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "GenUser", // Reference to the FypRegistration model
    required: true,
  },
  filePath: {
    type: String,
    default: null,
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
});

// Create a model based on the schema
const Announcement = mongoose.model("Announcement", announcementSchema);

// Export the model
module.exports = Announcement;
