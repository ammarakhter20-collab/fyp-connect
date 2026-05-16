const ExamAssignment = require("../../models/CoordinatorModels/ExamAssignment");
const Panel = require("../../models/CoordinatorModels/PenalModel");
const Feedback = require("../../models/SupervisorModels/FeedbackModel");

const FypRegistration = require("../../models/StudentModels/fypRegModel");
// Controller function to create an exam assignment
const createExamAssignment = async (req, res) => {
  try {
    const {
      partStatus,
      groupId,
      termId,
      departmentId,
      examTitle,
      points,
      dueDate,
      dueTime,
      assignedDate,
      instruction,
      attachPdf,
    } = req.body;
    const examAssignment = new ExamAssignment({
      partStatus,
      groupId,
      termId,
      departmentId,
      examTitle,
      points,
      dueDate,
      dueTime,
      assignedDate,
      instruction,
      attachPdf,
    });
    await examAssignment.save();
    res
      .status(201)
      .json({ message: "Marks assigned successfully", examAssignment });
  } catch (error) {
    console.error("Error assigning marks:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to fetch all exam assignments
const getExamAssignments = async (req, res) => {
  try {
    console.log("Check");
    console.log("Check");
    console.log("Check");
    const { userId } = req.params;
    const examAssignments = await ExamAssignment.find({})
      .populate({ model: "FypRegistration", path: "groupId" })
      .populate("departmentId")
      .populate("termId")
      .populate("submitBy")
      .exec();

    res.status(200).json({ examAssignments });
  } catch (error) {
    console.error("Error fetching exam assignments:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getExamAssignmentsByPartStatus = async (req, res) => {
  try {
    // Assuming userId is passed in the request or can be extracted from the session
    const userId = req.params.userid;
    console.log("User ID : ", userId);
    // Find the partStatus of the FYPRegistration for the user
    const Registrations = await FypRegistration.find({});

    if (!Registrations) {
      return res.status(404).json({ message: "FYPRegistration not found" });
    }
    const FypRegistrations = Registrations.filter(
      (request) => request.selectedOption._id.toString() === userId
    );

    const partStatus = FypRegistrations.partStatus;

    // Fetch Exam Assignments with matching partStatus
    const examAssignments = await ExamAssignment.find({
      partStatus: partStatus,
    });

    res.status(200).json({ FypRegistrations });
  } catch (error) {
    console.error("Error fetching Exam Assignments:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getApprovedExamReports = async (req, res) => {
  try {
    const userId = req.params.userid;
    console.log("User ID : ", userId);

    // Fetch and populate necessary fields, including nested selectedOption
    const examAssignments = await ExamAssignment.find({
      reportStatus: "submitted",
    })
      .populate({
        path: "groupId",
        populate: { path: "selectedOption", model: "GenUser" }
      })
      .populate("termId")
      .populate("departmentId")
      .populate("submitBy");

    if (!examAssignments) {
      return res.status(200).json({ examAssignments: [] });
    }

    const approvedExams = examAssignments.filter(
      (request) => request.groupId && request.groupId.selectedOption && request.groupId.selectedOption._id.toString() === userId
    );

    res.status(200).json({ examAssignments: approvedExams });
  } catch (error) {
    console.error("Error fetching Exam Assignments:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { status, examId, feedback, groupId } = req.body;
    console.log(req.body);
    const updatedExamAssignment = await ExamAssignment.findByIdAndUpdate(
      examId,
      { reportStatus: status },
      { new: true }
    );

    if (!updatedExamAssignment) {
      return res.status(404).json({ message: "Exam Assignment not found" });
    }

    if (feedback && groupId) {
      // Call the addFeedback function
      await addFeedback(groupId, feedback);
    }

    res.status(200).json({
      message: "Report status updated successfully",
      examAssignment: updatedExamAssignment,
    });
  } catch (error) {
    console.error("Error updating report status:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getExamReportsAsExaminer = async (req, res) => {
  // try {
  //   // Assuming userId is passed in the request or can be extracted from the session
  //   const userId = req.params.userid;
  //   console.log("User ID in exam reports for examiner: ",userId);
  //   // Find the partStatus of the FYPRegistration for the user
  //   const examAssignments = await ExamAssignment.find({}).populate('penal').populate("termId").populate("departmentId").populate("groupId")

  //   if (examAssignments.length < 0) {
  //     return res.status(404).json({ message: 'Exam not found' });
  //   }
  //   const approvedExams = examAssignments.filter(request => request.groupId.selectedOption._id.toString() === userId);
  //   //const partStatus = FypRegistrations.partStatus;
  //   // Fetch Exam Assignments with matching partStatus
  //   //const examAssignments = await ExamAssignment.find({ partStatus: partStatus });
  //   res.status(200).json({ examAssignments });
  // } catch (error) {
  //   console.error('Error fetching Exam Assignments:', error.message);
  //   res.status(500).json({ error: 'Internal server error' });
  // }

  try {
    const { userid: userId } = req.params;

    console.log(userId, "ID of the user");

    // Find panel details where the member is the specified userId
    const panelDetails = await Panel.find({
      "members.member": userId,
    });

    // Extract panel codes from the panel details
    const panelCodes = panelDetails.map((panel) => panel._id);

    // Find exam assignments where the panel code is in the extracted panel codes
    const examReports = await ExamAssignment.find({
      penal: { $in: panelCodes },
      reportStatus: "submitted",
    })
      .populate("penal")
      .populate("termId")
      .populate("departmentId")
      .populate({
        path: "groupId",
        populate: {
          path: "selectedOption",
          model: "GenUser",
        },
      })
      .populate("submitBy")
      .exec();

    res.status(200).json({ examReports });
  } catch (error) {
    console.error("Error fetching exam assignments:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addFeedback = async (groupId, feedback) => {
  try {
    // Create a new feedback document
    const newFeedback = new Feedback({ feedback, groupId });
    // Save the feedback document
    await newFeedback.save();
    // console.log("Feedback added:", newFeedback);
  } catch (error) {
    console.error("Error adding feedback:", error.message);
    throw new Error("Failed to add feedback");
  }
};

const getExamAssignmentsByGroupId = async (req, res) => {
  try {
    const { groupId } = req.params;
    console.log(groupId, "IDDDDDDDDDDDDDDDDDDDDDDDDDD");
    const examAssignments = await ExamAssignment.find({ groupId })
      .populate({ model: "FypRegistration", path: "groupId" })
      .populate("departmentId")
      .populate("termId")
      .populate("submitBy")
      .populate({
        path: "penal",
        populate: {
          path: "members.member",
          model: "GenUser",
          populate: { path: "department", model: "Department" },
        },
      })
      .exec();

    res.status(200).json({ examAssignments });
  } catch (error) {
    console.error("Error fetching exam assignments:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createExamAssignment,
  getExamAssignments,
  getExamAssignmentsByPartStatus,
  getApprovedExamReports,
  updateReportStatus,
  getExamReportsAsExaminer,
  getExamAssignmentsByGroupId,
};
