// const mongoose = require("mongoose");
// const User = require("../models/GenUserModel");
// const FYPGroup = require("../models/fypRegModel");

// const MemberAttendanceSchema = new mongoose.Schema({
//     member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     status: {
//         type: String,
//         default: "present",
//         enum: ["present", "absent"],
//     },
// });

// const FYPGroupAttendanceSchema = new mongoose.Schema({

//     meetingNo: {
//         type: Number,
//         required: true,
//     },
//     meetingDate: {
//         type: Date,
//         required: true,
//     },
//     meetingStartTime: {
//         type: Date,
//         required: true,
//     },
//     meetingEndTime: {
//         type: Date,
//         required: true,
//     },
//     memberAttendances: {
//         type: [MemberAttendanceSchema],
//         required: true,
//     },
//     fypgroup: { type: mongoose.Schema.Types.ObjectId, ref: 'FypRegistration', required: true }, // Reference to FypRegistration model
// });

// const FYPGroupAttendance = mongoose.model("FYPGroupAttendance", FYPGroupAttendanceSchema);

// module.exports = FYPGroupAttendance;

const mongoose = require("mongoose");
const User = require("../AdminModels/GenUserModel");
const FYPGroup = require("../StudentModels/fypRegModel");

const MemberAttendanceSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser",
    required: true,
  },
  status: {
    type: String,
    default: "present",
    enum: ["present", "absent"],
  },
});

const MeetingSchema = new mongoose.Schema({
  meetingNo: {
    type: Number,
    required: true,
  },
  meetingDate: {
    type: Date,
    required: true,
  },
  meetingStartTime: {
    type: Date,
    required: true,
  },
  meetingEndTime: {
    type: Date,
    required: true,
  },
  memberAttendances: {
    type: [MemberAttendanceSchema],
    required: true,
  },
});

const PartStatusSchema = new mongoose.Schema({
  part: {
    type: String,
    required: true,
    default: "part-I",
    enum: ["part-I", "part-II"],
  },
  meetings: {
    type: [MeetingSchema],
    required: true,
  },
});

const FYPGroupAttendanceSchema = new mongoose.Schema({
  fypgroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FypRegistration",
    required: true,
  },
  partStatus: {
    type: [PartStatusSchema],
    required: true,
  },
});
const FYPGroupAttendance = mongoose.model(
  "FYPGroupAttendance",
  FYPGroupAttendanceSchema
);

module.exports = FYPGroupAttendance;
