const mongoose = require("mongoose");

const PanelMemberSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser",
    required: true,
  },
  role: {
    type: String,
    enum: ["Panel Head", "Examiner"],
    default: "Examiner",
    required: false,
  },
  evaluationStatus: {
    type: String,
    enum: ["marked", "pending"],
    default: "pending", // Default value for resultStatus
  },
});

const PanelDetailsSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  // program: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Program",
  //   required: true,
  // },
  term: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FYPTerm",
    required: true,
  },
  panelCode: {
    type: String,
    required: true,
  },
  PanelMembers: {
    type: [PanelMemberSchema],
    required: true,
  },
  panelName: {
    type: String,
    unique: true,
  },
});

const PanelDetails = mongoose.model("PanelDetails", PanelDetailsSchema);

module.exports = PanelDetails;
