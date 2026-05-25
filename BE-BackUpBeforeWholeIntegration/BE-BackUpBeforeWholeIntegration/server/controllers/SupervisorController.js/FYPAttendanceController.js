const mongoose = require("mongoose");
const FYPGroupAttendance = require("../../models/SupervisorModels/FYPAttendanceModel");
const FypRegistration = require("../../models/StudentModels/fypRegModel");
const User = require("../../models/AdminModels/GenUserModel");

const createAttendance = async (req, res) => {
  const {
    meetingNo,
    meetingDate,
    meetingStartTime,
    meetingEndTime,
    attendanceStatus,
    groupId,
    partStatus,
  } = req.body.meetingDetails;

  try {
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid groupId" });
    }

    const newMeeting = {
      meetingNo,
      meetingDate: new Date(meetingDate),
      meetingStartTime: new Date(meetingStartTime),
      meetingEndTime: new Date(meetingEndTime),
      memberAttendances: Object.values(attendanceStatus).map(
        ({ _id, attendance }) => ({
          member: new mongoose.Types.ObjectId(_id),
          status: attendance === "P" ? "present" : "absent",
        })
      ),
    };

    let attendance = await FYPGroupAttendance.findOne({
      fypgroup: groupId,
      "partStatus.part": partStatus,
    });

    if (!attendance) {
      // Create a new partStatus entry if it doesn't exist
      attendance = await FYPGroupAttendance.findOneAndUpdate(
        { fypgroup: groupId },
        { $push: { partStatus: { part: partStatus, meetings: [newMeeting] } } },
        { upsert: true, new: true }
      );
    } else {
      // Append the new meeting to the existing partStatus
      attendance = await FYPGroupAttendance.findOneAndUpdate(
        { fypgroup: groupId, "partStatus.part": partStatus },
        { $push: { "partStatus.$.meetings": newMeeting } },
        { new: true }
      );
    }

    res
      .status(201)
      .json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    console.error("Error marking attendance:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAttendance = async (req, res) => {
  try {
    const attendance = await FYPGroupAttendance.find();

    if (!attendance || attendance.length === 0) {
      return res.status(404).json({ message: "Attendance data not found" });
    }

    res.status(200).json({ attendance });
  } catch (error) {
    console.error("Error fetching attendance data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
//MOST IMP QUERY!!! DON'T Forget
//       const filteredFyps = registeredfyps.filter(request => request.selectedOption._id.toString() === userId);

//GET ATTENDANCE OF GROUPS UNDER SUPERVISION
const getAttendanceUnderSupervision = async (req, res) => {
  console.log("Check in");
  console.log("Check in");
  console.log("Check in");
  console.log("Check in");
  console.log("Check in");
  const grpId = req.params.id || req.params.userid;
  try {
    if (grpId) {
      let fypGroup = await FYPGroupAttendance.find({ fypgroup: grpId })
        .populate({
          path: "partStatus.meetings.memberAttendances.member",
          model: "GenUser",
          options: { strictPopulate: false },
        })
        .populate({
          path: "fypgroup",
          populate: {
            path: "groupMembers",
            model: "GenUser",
          }
        })
        .exec();

      if (!fypGroup || fypGroup.length === 0) {
        // Fetch the group registration to build a default blank attendance object
        const fypRegistration = await FypRegistration.findById(grpId)
          .populate({
            path: "groupMembers",
            model: "GenUser",
          });

        if (!fypRegistration) {
          return res.status(404).json({ message: "Group not found" });
        }

        // Return a simulated fypGroup array with an empty partStatus array
        fypGroup = [{
          fypgroup: fypRegistration,
          partStatus: []
        }];
      }

      res.status(200).json({ fypGroup });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching attendance data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createAttendance,
  getAttendance,
  getAttendanceUnderSupervision,
};

// const getAttendanceUnderSupervision = async (req, res) => {
//   const grpId = req.params.userid;
//   console.log("Userrrrrr", grpId)
//   try {
//     if (grpId) {
//       groups = await FYPGroupAttendance.find().populate({
//         path: 'fypgroup',
//         model: 'FypRegistration',
//         populate: {
//           path: 'selectedOption',
//           model: 'User',
//         },
//       }).populate({
//         path: 'memberAttendances.member',
//         model: 'User',
//       }).exec();

//       const fypGroup = groups.filter(request => request.fypgroup._id.toString() === grpId);

//       // if (!filteredFyps || filteredFyps.length === 0) {
//       //   return res.status(404).json({ message: "Attendance data not found" });
//       // }

//       res.status(200).json({ fypGroup });

//     } else {
//       return res.status(404).json({ message: "User not found" });

//     }
//   } catch (error) {
//     console.error("Error fetching attendance data:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
