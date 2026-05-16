const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GenUser = require("../AdminModels/GenUserModel");
const User = require("../AdminModels/GenUserModel");
const Technology = require("../CoordinatorModels/Technology");
const Platform = require("../CoordinatorModels/PlatformModel");

const GroupMemberSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  phoneNumber: String,
  email: String,
  secondaryEmail: String,
  password: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department", // Assuming the model name for Department is 'Department'
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program", // Assuming the model name for Program is 'Program'
  },
  term: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FYPTerm", // Assuming the model name for FYPTerm is 'FYPTerm'
  },

  cnic: String,
  address: String,
  role: String,
  registrationNumber: String,
  creditHours: Number,
  cgpa: Number,
  gpa: Number,
  __v: Number,
});

const fypRegistrationSchema = new Schema({
  // groupMembers: {
  //   type: [GroupMemberSchema],
  //   required: true,
  // },
  groupMembers: [GroupMemberSchema],
  // groupMembers: [GroupMemberSchema],
  // selectedOption: { type: Object, required: true },
  selectedOption: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser",
    required: true,
  },
  selectedTechnology: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Technology",
    required: true,
  },
  topicData: {
    type: Object, // Assuming topicData is an object
    required: true,
  },
  selectedPlatform: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Platform",
    required: true,
  },
  reqStatus: {
    type: String,
    required: true,
  },

  // selectedFile: {
  //   type: String,
  // },

  partStatus: {
    type: String,
    default: "part-I", // Setting default value to "part-I"
    required: false,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  assignedPanel: { type: Object, ref: "PanelDetails", required: false },

  term: { type: Object, ref: "FYPTerm", required: false },

  deniedSupervisors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser"
  }],
});

module.exports = mongoose.model("FypRegistration", fypRegistrationSchema);
