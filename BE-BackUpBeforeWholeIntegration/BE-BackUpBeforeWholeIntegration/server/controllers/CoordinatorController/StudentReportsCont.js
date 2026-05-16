const StudentReport = require("../../models/CoordinatorModels/StudentReportsModel");
const GenUser = require("../../models/AdminModels/GenUserModel");
const Feedback = require("../../models/SupervisorModels/FeedbackModel");
const mongoose = require("mongoose");
const uploadStudentReport = async (req, res) => {
  console.log("Upload Report Function Called");
  try {
    console.log("Checking File ", req.file);
    console.log("Checking Request Body", req.body);
    const { SubmittedBy, FYPGroup, Exam } = req.body;
    console.log("Checking Submitted By", SubmittedBy);
    console.log("Checking FYP Group", FYPGroup);
    console.log("Checking Exam", Exam);

    // Create a new report
    let filePath = null;
    if (req.file) {
      // Assuming you're storing the file path in the database
      filePath = req.file.path;
    }

    console.log("Checking file path", filePath);

    // If FYPGroup is an array, take the first element
    const fypGroupId = Array.isArray(FYPGroup) ? FYPGroup[0] : FYPGroup;
    console.log("GroupIDddddddddddd Conversion", fypGroupId);

    const newReport = new StudentReport({
      submitReportPdf: filePath,
      uploadedBy: new mongoose.Types.ObjectId(SubmittedBy),
      FYPGroup: new mongoose.Types.ObjectId(fypGroupId),
      Exam: new mongoose.Types.ObjectId(Exam),
    });

    // Save the report to the database
    await newReport.save();
    res.status(201).json({ newReport });
  } catch (error) {
    console.error("Error uploading report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateStudentReport = async (req, res) => {
  try {
    const { SubmittedBy, FYPGroup, Exam } = req.body;
    let filePath = null;
    if (req.file) {
      filePath = req.file.path;
    }

    const updatedReport = await StudentReport.findOneAndUpdate(
      { FYPGroup, Exam },
      {
        submitReportPdf: filePath,
        uploadedBy: SubmittedBy,
        // Reset status back to pending on resubmit
        status: "pending",
        visibleToPanel: false,
        supervisorFeedback: "",
      },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.status(200).json({ updatedReport });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchedReportsByGroupId = async (req, res) => {
  console.log("Fetched Reportssssss Called");
  try {
    const { groupId } = req.params;
    console.log("Checking passed Group Id", groupId);

    // Fetch reports for the specified group ID and populate related fields
    const reports = await StudentReport.find({ FYPGroup: groupId })
      .populate("uploadedBy")
      .populate("FYPGroup")
      .populate("Exam");

    if (!reports.length) {
      return res
        .status(404)
        .json({ message: "No reports found for the given group ID" });
    }

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const CheckReportExist = async (groupId, examId) => {
  try {
    const report = await StudentReport.findOne({
      FYPGroup: groupId,
      Exam: examId,
    });
    return !!report; // Return true if a report exists, otherwise false
  } catch (error) {
    console.error("Error checking report existence:", error);
    throw new Error("Internal server error");
  }
};

// Example usage inside an endpoint
const checkReportExistEndpoint = async (req, res) => {
  try {
    const { groupId, examId } = req.params;
    const exists = await CheckReportExist(groupId, examId);
    res.status(200).json({ exists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, feedback } = req.body;

    console.log("Updating report status:", reportId, status);

    const updateFields = {
      status: status,
      visibleToPanel: status === "approved" ? true : false,
      supervisorFeedback: status === "rejected" && feedback ? feedback : "",
    };

    const updatedReport = await StudentReport.findByIdAndUpdate(
      reportId,
      updateFields,
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Student Report not found" });
    }

    res.status(200).json({
      message: "Report status updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error updating report status:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchApprovedReportsForPanel = async (req, res) => {
  try {
    const { panelId } = req.params;
    console.log("Fetching approved reports for panel:", panelId);

    // Find all approved reports where the FYPGroup belongs to this panel
    const reports = await StudentReport.find({ visibleToPanel: true })
      .populate({
        path: "FYPGroup",
        match: { assignedPanel: panelId },
      })
      .populate("Exam")
      .populate("uploadedBy", "name registrationNumber");

    // Filter out reports where FYPGroup didn't match the panel
    const filteredReports = reports.filter((r) => r.FYPGroup !== null);

    res.status(200).json({ reports: filteredReports });
  } catch (error) {
    console.error("Error fetching panel reports:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  uploadStudentReport,
  fetchedReportsByGroupId,
  CheckReportExist,
  checkReportExistEndpoint,
  updateStudentReport,
  updateReportStatus,
  fetchApprovedReportsForPanel,
};
