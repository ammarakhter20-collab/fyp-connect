const mongoose = require("mongoose");
const Marks = require("../../models/SupervisorModels/marks");
// const FypRegistration = require("../models/fypRegModel");
// const GenUser = require("../models/GenUserModel");
// const Feedback = require("../models/SupervisorModels/FeedbackModel");

const assignMarks = async (req, res) => {
  const {
    taskId,
    userid,
    marks,
    selectedGroup,
    partStatus,
    feedback,
    groupId,
  } = req.body;

  console.log(req.body, "Look here are we");

  try {
    const marksArray = Object.values(marks); // Convert marks object into an array of values
    const newMarks = new Marks({
      task: taskId,
      examiner: userid,
      marks: marksArray.map(({ id: studentId, marks: obtainedMarks }) => ({
        student: studentId,
        obtainedMarks,
      })),
      partStatus,
    });

    if (feedback && groupId) {
      // Call the addFeedback function
      await addFeedback(groupId, feedback);
    }

    await newMarks.save();

    res
      .status(201)
      .json({ message: "Marks assigned successfully", marks: newMarks });
  } catch (error) {
    console.error("Error assigning marks:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const getMarks = async (req, res) => {
//   const { taskId, userid } = req.params;
//   const { stdid: stdId } = req.params;
//   console.log(stdId, "received stdid");

//   try {
//     let marks;
//     marks = await Marks.find()
//       .populate("marks.student")
//       .populate("task")
//       .exec();

//     const filteredMarks = marks
//       .filter((mark) => {
//         return mark.marks.some((m) => m.student._id.toString() === stdId);
//       })
//       .map((mark) => {
//         return {
//           examiner: mark.examiner,
//           task: mark.task,
//           marks: mark.marks.filter((m) => m.student._id.toString() === stdId),
//         };
//       });

//     // if (!taskId && !userid) {
//     //     marks = await Marks.find();
//     // } else {
//     //     const taskFilter = taskId ? { task: taskId } : {};
//     //     const examinerFilter = userid ? { examiner: userid } : {};

//     //     marks = await Marks.find({ ...taskFilter, ...examinerFilter });
//     // }

//     res.status(200).json({ filteredMarks });
//   } catch (error) {
//     console.error("Error fetching marks:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const fetchTaskMarks = async (req, res) => {
  console.log("Inside fetch marks tasks controller");
  try {
    const groupId = req.params.groupId;
    console.log("CHecking group Id", groupId);
    const taskId = req.params.taskId;

    console.log("CHecking task Id", taskId);
    // Check if groupId is provided
    if (!groupId && !taskId) {
      return res.status(400).json({ error: "groupId parameter is required" });
    }

    // Retrieve assigned tasks for the specified groupId from the database
    const assignedMarks = await Marks.find({ task: taskId });
    console.log("Checking fetched marks", assignedMarks);

    res.status(200).json(assignedMarks);
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// PartStatus [
//     0{part-I
//     meetings[

//     ]},
//     1{part-II
//         meetings[]}
// ]

const updateMarks = async (req, res) => {
  const { marksId } = req.params;
  const { taskId, userid, marks, partStatus } = req.body;

  try {
    const updatedMarks = await Marks.findByIdAndUpdate(
      marksId,
      {
        task: taskId,
        examiner: userid,
        marks: marks.map(({ studentId, obtainedMarks, totalMarks }) => ({
          student: studentId,
          obtainedMarks,
          totalMarks,
        })),
        partStatus,
      },
      { new: true }
    );

    if (!updatedMarks) {
      return res.status(404).json({ message: "Marks not found" });
    }

    res
      .status(200)
      .json({ message: "Marks updated successfully", marks: updatedMarks });
  } catch (error) {
    console.error("Error updating marks:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addFeedback = async (groupId, feedback) => {
  try {
    // Create a new feedback document
    const newFeedback = new Feedback({ feedback, groupId });
    // Save the feedback document
    await newFeedback.save();
    console.log("Feedback added:", newFeedback);
  } catch (error) {
    console.error("Error adding feedback:", error.message);
    throw new Error("Failed to add feedback");
  }
};

module.exports = {
  assignMarks,
  // getMarks,
  updateMarks,
  fetchTaskMarks,
};
