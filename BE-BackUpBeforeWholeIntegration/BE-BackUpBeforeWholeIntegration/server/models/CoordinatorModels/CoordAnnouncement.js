const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  announFor: {
    type: String,
    required: true,
    enum: [
      "supervisors",
      "fyp_groups_part1",
      "fyp_groups_part2",
      "all_fyp_groups",
      "all",
    ],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser",
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Student", "supervisor", "coordinator", "Coordinator"], // Add all possible roles here
  },
});

const Announcement = mongoose.model("CoordAnnouncement", announcementSchema);

module.exports = Announcement;
