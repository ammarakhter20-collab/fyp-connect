const mongoose = require("mongoose");
const User = require("../AdminModels/GenUserModel");
const FypRegistration = require("./fypRegModel");

const Schema = mongoose.Schema;

const FYPTechnologyChangeRequestSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model for students
    required: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FypRegistration", // Assuming you have a User model for students
    required: true,
  },
  fypTechnology: {
    type: String,
    required: true,
  },
  newFypTechnology: {
    type: String,
    required: true,
  },
  reasonForChange: {
    type: String,
    required: true,
  },
  techReqStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model(
  "FYPTechnologyChangeRequest",
  FYPTechnologyChangeRequestSchema
);
