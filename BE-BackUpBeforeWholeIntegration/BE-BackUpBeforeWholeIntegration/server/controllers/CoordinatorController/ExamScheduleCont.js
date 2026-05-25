const CreateExamSchedule = require("../../models/CoordinatorModels/ExamScheduleModel");
const CreatedExamModel = require("../../models/CoordinatorModels/ExamCreationModel");
const ExamTypeModel = require("../../models/CoordinatorModels/ExamTypeModel");
const nodemailer = require("nodemailer");
const Project = require("../../models/StudentModels/fypRegModel");
const Coordinator = require("../../models/AdminModels/GenUserModel"); // Adjust the path to your Coordinator model
const moment = require("moment");

const createTransporter = async (coordinatorId) => {
  // Fetch the coordinator details using the ID
  const coordinator = await Coordinator.findById(coordinatorId);

  if (!coordinator || !coordinator.secondaryEmail || !coordinator.appPassword) {
    console.warn("Coordinator details missing (Email/AppPassword). Email notifications will be SKIPPED.");
    return null; // Return null to indicate no transporter
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: coordinator.secondaryEmail, // Use the coordinator's secondary email
      pass: coordinator.appPassword, // Coordinator's email password or app password
    },
  });
};

// Function to send email notifications to students and supervisors
const sendNotification = async (panel, transporter, examDetails) => {
  try {
    // Fetch all FYP registrations associated with the selected panel
    const fypRegistrations = await Project.find({
      assignedPanel: panel,
    })
      .populate("selectedOption") // Populate the supervisor (selectedOption)
      .populate("groupMembers"); // Populate the group members (students)

    console.log("Checking FYP Registrations", fypRegistrations);

    // Iterate over each FYP registration
    for (const fyp of fypRegistrations) {
      // Collect student and supervisor emails
      const studentEmails = fyp.groupMembers.map(
        (student) => student.secondaryEmail
      );

      console.log("Checking Secondary Emails of Students", studentEmails);
      const supervisorEmails = [fyp.selectedOption.secondaryEmail];

      console.log("Checking Supervisor Emails", supervisorEmails);
      const allEmails = [...studentEmails, ...supervisorEmails];

      console.log("Checking Exam Details");
      console.log("Checking Exam name", examDetails.name);
      console.log("Checking exam date", examDetails.date);
      console.log("Checking exam Venue", examDetails.venue);
      console.log("Checking exam Time", examDetails.time);

      // Compose email message
      const mailOptions = {
        from: transporter.options.auth.user,
        to: allEmails,
        subject: "Exam Schedule Notification",
        text: `Dear Student,

        The schedule for the ${examDetails.name} exam is:
            Date: ${examDetails.date}
            Venue: ${examDetails.venue}
            Time: ${examDetails.time}

        Kind regards,
        Capital Management System Team.

        Disclaimer:
        The information contained in this message, including any attachments, may be privileged and confidential and is intended only for the use of the individual and/or entity identified in the address of this message. If you are not an intended recipient, please notify the sender and delete and destroy this message, including any backup copies. Emails cannot be guaranteed to be secure or error-free as the message and any attachments could be intercepted, corrupted, lost, delayed, incomplete, and/or amended. The organization does not accept liability for damage caused by this email or any attachments and may monitor email traffic.`,
      };

      // Send email
      await transporter.sendMail(mailOptions);
    }
  } catch (error) {
    console.error("Error sending email notifications:", error);
  }
};

const getExamDetails = async (examId) => {
  try {
    console.log(examId, "Exam ID received");

    const exam = await CreateExamSchedule.find({ CreatedExam: examId })
      .populate({
        path: "panel",
        populate: {
          path: "PanelMembers.member",
        },
      })
      .populate({
        path: "CreatedExam",
        populate: [
          {
            path: "ExamType",
          },
          {
            path: "Term",
          },
          {
            path: "CLOForExams",
            populate: {
              path: "CLOs",
              populate: {
                path: "Questions",
              },
            },
          },
        ],
      });

    if (!exam) {
      return { message: "No schedule found for the given exam ID" };
    }

    return { exam };
  } catch (error) {
    console.error("Error fetching exam details:", error);
    throw new Error("Internal server error");
  }
};

const fs = require('fs');
const path = require('path');

const createExamSchedule = async (req, res) => {
  const logFile = path.join(__dirname, '../../../../server_debug.log');
  const log = (msg) => fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);

  log("Create Exam Schedule Cont called");
  try {
    const { panel, ExamDate, ExamTime, Venue, CreatedExam, coordinatorId } = req.body;
    log(`Payload: ${JSON.stringify(req.body)}`);

    console.log("panel", panel);
    console.log("ExamDate", ExamDate);
    console.log("ExamTime", ExamTime);
    console.log("Venue", Venue);
    console.log("CreatedExam", CreatedExam);
    console.log("coordinatorId", coordinatorId);

    // Create a transporter using the coordinator's email
    const transporter = await createTransporter(coordinatorId);

    // Fetch CreatedExam details
    const examDetails = await CreatedExamModel.findById(CreatedExam);
    if (!examDetails) {
      return res.status(404).json({ error: "CreatedExam not found" });
    }

    // Fetch ExamType details to get the exam name
    const examTypeDetails = await ExamTypeModel.findById(examDetails.ExamType);
    if (!examTypeDetails) {
      return res.status(404).json({ error: "ExamType not found" });
    }

    // Format exam details
    const examInfo = {
      name: examTypeDetails.examName,
      date: moment(ExamDate).format("YYYY-MM-DD"),
      time: moment(ExamTime, "HH:mm").format("hh:mm A"), // Ensure hh:mm A format
      venue: Venue,
    };

    // Ensure ExamTime is in the correct format
    const formattedExamTime = moment(ExamTime, "HH:mm").format("hh:mm A");

    // Check if there is already an exam scheduled for the given panel and exam
    let existingSchedule = await CreateExamSchedule.findOne({ panel, CreatedExam }).exec();

    console.log("SChedule Checking Existing or not", existingSchedule);

    if (existingSchedule) {
      // If a schedule exists, update its details
      existingSchedule.ExamDate = ExamDate;
      existingSchedule.ExamTime = formattedExamTime;
      existingSchedule.Venue = Venue;
      existingSchedule.CreatedExam = CreatedExam;

      // Save the updated schedule to the database
      await existingSchedule.save();

      // Send notifications only if transporter exists
      if (transporter) {
        await sendNotification(panel, transporter, examInfo);
      } else {
        log("Skipping email notification (no transporter)");
      }

      // Return success response for the update
      return res.status(200).json({
        message: "Exam schedule updated successfully (Email skipped)",
        examSchedule: existingSchedule,
      });
    } else {
      // If no schedule exists, create a new exam schedule object
      const newExamSchedule = new CreateExamSchedule({
        panel,
        ExamDate,
        ExamTime: formattedExamTime, // Use formatted time
        Venue,
        CreatedExam,
      });

      // Save the new exam schedule to the database
      await newExamSchedule.save();

      // Send notifications only if transporter exists
      if (transporter) {
        await sendNotification(panel, transporter, examInfo);
      } else {
        log("Skipping email notification (no transporter)");
      }

      // Return success response for the creation
      return res.status(201).json({
        message: "Exam schedule created successfully (Email skipped)",
        examSchedule: newExamSchedule,
      });
    }
  } catch (error) {
    log(`Error: ${error.message}`);
    console.error("Error creating/updating exam schedule:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
const getScheduledExams = async (req, res) => {
  try {
    // Fetch all scheduled exams from the database and populate 'panel', 'CreatedExam', and 'ExamType' inside 'CreatedExam'
    const exams = await CreateExamSchedule.find()
      .populate("panel")
      .populate({
        path: "CreatedExam",
        populate: {
          path: "ExamType",
        },
      });

    // Return the fetched exams
    res.status(200).json({ exams });
  } catch (error) {
    console.error("Error fetching scheduled exams:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSpecificScheduledExam = async (req, res) => {
  console.log("Get Specific exam scheduled Called");
  try {
    // Extract role from query and termId from params
    let { role } = req.query;
    const { panelId } = req.params;

    // Normalize role — capitalize first letter to match enum ("Student", "Supervisor", etc.)
    if (role) {
      role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    }

    console.log("PanelId:", panelId, "Role (normalized):", role);

    // Fetch scheduled exams that match the role and termId
    const exams = await CreateExamSchedule.find()
      .populate("panel")
      .populate({
        path: "CreatedExam",
        populate: {
          path: "ExamType",
        },
      });

    console.log("Total scheduled exams found:", exams.length);

    // Filter exams to ensure panel matches AND examTypeFor matches role or 'All'
    const filteredExams = exams.filter((exam) => {
      if (!exam.panel) {
        console.log("Exam has no panel:", exam._id);
        return false;
      }
      if (!exam.CreatedExam) {
        console.log("Exam has no CreatedExam:", exam._id);
        return false;
      }

      const panelMatch = exam.panel._id.toString() === panelId;
      
      // If ExamType is not populated, include if panel matches
      if (!exam.CreatedExam.ExamType) {
        return panelMatch;
      }

      const examTypeFor = exam.CreatedExam.ExamType.examTypeFor;
      const roleMatch = examTypeFor === "All" || examTypeFor === role;

      console.log(`Panel match: ${panelMatch}, ExamTypeFor: ${examTypeFor}, Role: ${role}, RoleMatch: ${roleMatch}`);
      return panelMatch && roleMatch;
    });

    console.log("Filtered exams count:", filteredExams.length);

    // Check if any exams were found
    if (filteredExams.length === 0) {
      return res
        .status(404)
        .json({ message: "No exams found for the given panel and role" });
    }

    // Return the filtered exams
    res.status(200).json({ exams: filteredExams });
  } catch (error) {
    console.error("Error fetching specific scheduled exams:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};
const getExamsForFaculty = async (req, res) => {
  console.log("Get Exams for Faculty Called");
  try {
    // Extract role from query
    let { role } = req.query;
    console.log("Checking Role", role);
    if (role === "faculty") {
      console.log("Inside If");
      role = "Supervisor";
    }
    console.log("Roleeeeeeeeeeeeeeeeee", role);
    // Fetch scheduled exams that match the role
    const exams = await CreateExamSchedule.find()
      .populate("panel")
      .populate({
        path: "CreatedExam",
        populate: {
          path: "ExamType",
        },
      });

    // Filter exams to ensure examTypeFor matches role or 'All'
    const filteredExams = exams.filter(
      (exam) =>
        exam.CreatedExam &&
        (exam.CreatedExam.ExamType.examTypeFor === "All" ||
          exam.CreatedExam.ExamType.examTypeFor === role)
    );

    // Check if any exams were found
    if (filteredExams.length === 0) {
      return res
        .status(404)
        .json({ message: "No exams found for the given role" });
    }

    // Return the filtered exams
    res.status(200).json({ exams: filteredExams });
  } catch (error) {
    console.error("Error fetching exams for faculty:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSpecificScheduledExam11 = async (req, res) => {
  try {
    let { role, termId } = req.params;
    console.log(termId, "Term ID received");
    if (role === "faculty") {
      role = "Supervisor";
    }
    console.log(role, "ROLEEEE");
    console.log("Get Specific exam scheduled Called body", role);

    const exams = await CreateExamSchedule.find()
      .populate({
        path: "panel",
        populate: {
          path: "PanelMembers.member",
        },
      })
      .populate({
        path: "CreatedExam",
        populate: [
          {
            path: "ExamType",
          },
          {
            path: "Term",
          },
          {
            path: "CLOForExams",
            populate: {
              path: "CLOs",
              populate: {
                path: "Questions",
              },
            },
          },
        ],
      });

    const filteredExams = exams.filter(
      (exam) =>
        exam.CreatedExam &&
        exam.CreatedExam.Term._id.toString() === termId &&
        (exam.CreatedExam.ExamType.examTypeFor === "All" ||
          exam.CreatedExam.ExamType.examTypeFor === role)
    );

    // Check if any exams were found
    if (filteredExams.length === 0) {
      return res
        .status(404)
        .json({ message: "No exams found for the given term and role" });
    }

    res.status(200).json({ filteredExams });
  } catch (error) {
    console.error("Error fetching specific scheduled exams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getExamScheduleByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter

    const examSchedules = await CreateExamSchedule.find({})
      .populate({
        path: "panel",
        populate: {
          path: "PanelMembers",
          match: { member: userId },
          model: "GenUser", // Assuming the model name for GenUser is GenUser
        },
      })
      .exec();

    // Filter out schedules where no matching PanelMembers are found
    const filteredSchedules = examSchedules.filter(
      (schedule) => schedule.panel.PanelMembers.length > 0
    );

    res.status(200).json(filteredSchedules);
  } catch (error) {
    console.error("Error fetching exam schedules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteExamSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSchedule = await CreateExamSchedule.findByIdAndDelete(id);

    if (!deletedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createExamSchedule,
  getScheduledExams,
  getSpecificScheduledExam,
  getExamsForFaculty,
  getSpecificScheduledExam11,
  getExamDetails,
  getExamScheduleByUserId,
  deleteExamSchedule,
};
