const FYPterm = require("../../models/AdminModels/FYPTermModel");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const GenUser = require("../../models/AdminModels/GenUserModel");
const FypRegistration = require("../../models/StudentModels/fypRegModel");
const FYPGroupAttendance = require("../../models/SupervisorModels/FYPAttendanceModel");
const ExamMarks = require("../../models/SupervisorModels/examMarksAssignment");
const TaskAssignment = require("../../models/SupervisorModels/TaskAssigmentModel");
const StudentReport = require("../../models/CoordinatorModels/StudentReportsModel");
const FYPTopicChangeRequest = require("../../models/StudentModels/TopicReqModel");
const FYPTechnologyChangeRequest = require("../../models/StudentModels/TechReqModel");
const FypChangeRequest = require("../../models/SupervisorModels/changeRequest");
const Feedback = require("../../models/SupervisorModels/FeedbackModel");
const CreateExamModel = require("../../models/CoordinatorModels/ExamCreationModel");
const ExamAssignment = require("../../models/CoordinatorModels/ExamAssignment");
const PanelDetails = require("../../models/CoordinatorModels/PenalModel");
const FYPRegistrationDeadline = require("../../models/CoordinatorModels/CreateFYPRegModel");
const PassFailCriteria = require("../../models/CoordinatorModels/PassFailCriteriaModel");
const SupervisorPercentage = require("../../models/CoordinatorModels/ManagePercentageModel");
const Evaluation = require("../../models/CoordinatorModels/EvaluateExamModel");
const Result = require("../../models/CoordinatorModels/ResultsModel");

// Use environment variable directly or load from a configuration file
const secretKey = process.env.TOKEN_KEY;


const createFYPterm = async (req, res) => {
  console.log("Inside FYPterm creation controller");
  const { sessionTerm, startDate, endDate } = req.body;

  try {
    const termStr = String(sessionTerm);
    if (!/^\d{3}$/.test(termStr)) {
      return res.status(400).json({ error: "Session Term must be exactly 3 digits (e.g., 251 or 253)." });
    }
    if (!/[13]$/.test(termStr)) {
      return res.status(400).json({ error: "Session Term must end with 1 or 3." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1. Check Maximum Life of 6 Months
    const maxEndDate = new Date(start);
    maxEndDate.setMonth(maxEndDate.getMonth() + 6);
    if (end > maxEndDate) {
      return res.status(400).json({ error: "Term duration cannot exceed 6 months." });
    }

    // 2. Check Maximum 2 Active Terms
    // Term model sets default status to 'activated' on creation
    const activeTermsCount = await FYPterm.countDocuments({ status: "activated" });
    if (activeTermsCount >= 2) {
      return res.status(400).json({ error: "Maximum of 2 active terms are allowed at a time." });
    }

    // 3. Check for uniqueness of sessionTerm
    const existingTerm = await FYPterm.findOne({ sessionTerm: sessionTerm });
    if (existingTerm) {
      return res.status(400).json({ error: `A term with the name '${sessionTerm}' already exists.` });
    }

    // 4. Check Maximum 2 Terms per Year
    const termYear = start.getFullYear();
    const yearStart = new Date(Date.UTC(termYear, 0, 1, 0, 0, 0));
    const yearEnd = new Date(Date.UTC(termYear, 11, 31, 23, 59, 59, 999));

    const termsInYearCount = await FYPterm.countDocuments({
      startDate: {
        $gte: yearStart,
        $lte: yearEnd
      }
    });

    if (termsInYearCount >= 2) {
      return res.status(400).json({ error: "all the two terms per year are already being created" });
    }

    const fypTerm = await FYPterm.create({
      sessionTerm,
      startDate,
      endDate,
    });

    // Generate token upon successful creation (optional)
    const token = jwt.sign({ fypTerm_id: fypTerm._id }, secretKey, {
      expiresIn: "1h",
    });

    console.log("FYPterm created successfully:", fypTerm._id);
    res.status(200).json({ fypTerm, token }); // Return the created FYPterm
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateFYPterm = async (req, res) => {
  console.log("Inside FYPterm update controller");
  const { selectedTermId } = req.body; // Extract selectedTermId from request body
  const { sessionTerm, startDate, endDate } = req.body;

  try {
    const termStr = String(sessionTerm);
    if (!/^\d{3}$/.test(termStr)) {
      return res.status(400).json({ error: "Session Term must be exactly 3 digits (e.g., 251 or 253)." });
    }
    if (!/[13]$/.test(termStr)) {
      return res.status(400).json({ error: "Session Term must end with 1 or 3." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1. Check Maximum Life of 6 Months
    const maxEndDate = new Date(start);
    maxEndDate.setMonth(maxEndDate.getMonth() + 6);
    if (end > maxEndDate) {
      return res.status(400).json({ error: "Term duration cannot exceed 6 months." });
    }

    // 2. Check Maximum 2 Terms per Year
    const termYear = start.getFullYear();
    const yearStart = new Date(Date.UTC(termYear, 0, 1, 0, 0, 0));
    const yearEnd = new Date(Date.UTC(termYear, 11, 31, 23, 59, 59, 999));

    const termsInYearCount = await FYPterm.countDocuments({
      _id: { $ne: selectedTermId },
      startDate: {
        $gte: yearStart,
        $lte: yearEnd
      }
    });

    if (termsInYearCount >= 2) {
      return res.status(400).json({ error: "all the two terms per year are already being created" });
    }

    // Find the FYPterm by ID and update its data
    const updatedTerm = await FYPterm.findByIdAndUpdate(
      selectedTermId,
      { sessionTerm, startDate, endDate },
      { new: true } // Return the updated document
    );

    if (!updatedTerm) {
      return res.status(404).json({ message: "FYPterm not found." });
    }

    console.log("FYPterm updated successfully:", updatedTerm._id);
    res.status(200).json({ updatedTerm });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkAndUpdateTermStatus = async () => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Fetch all terms from the database
    const allTerms = await FYPterm.find();

    // Loop through each term to check and update status
    for (const term of allTerms) {
      const endDate = new Date(term.endDate);

      // Compare the current date with the end date of each term
      if (currentDate > endDate && term.status === "activated") {
        // Update the status of the term to "deactivated"
        await FYPterm.findByIdAndUpdate(term._id, { status: "deactivated" });
        console.log(`Term ${term._id} status updated to deactivated.`);
      }
    }
  } catch (error) {
    console.error("Error checking and updating term status:", error);
  }
};

/* const cronJob = cron.schedule("0 0 * * *", async () => {
  console.log("Running term status update task...");
  await checkAndUpdateTermStatus();
}); */

// Start the cron job
// cronJob.start();
// console.log("Cron job scheduled to run daily at midnight.");

const findActivatedStatus = async (req, res) => {
  try {
    // Find terms with status: activated
    const activatedTerms = await FYPterm.find({ status: "activated" });

    // Check if activated terms exist
    const activatedFound = activatedTerms.length > 0;

    res.status(200).json({ activatedFound });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTermData = async (req, res) => {
  try {
    // Fetch all FYP terms from the database
    const fypTerms = await FYPterm.find();

    // Check if there are no terms found
    if (!fypTerms || fypTerms.length === 0) {
      return res.status(404).json({ message: "No FYP terms found." });
    }

    // Sort terms based on activation status (active terms first)
    fypTerms.sort((a, b) => {
      if (a.isActive && !b.isActive) return -1; // 'a' comes before 'b' if 'a' is active and 'b' is inactive
      if (!a.isActive && b.isActive) return 1; // 'b' comes before 'a' if 'b' is active and 'a' is inactive
      return 0; // no change in order if both are active or inactive
    });

    // Return the sorted terms
    res.status(200).json({ fypTerms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getActivatedTermsForCheck = async (req, res) => {
  try {
    // Fetch all activated FYP terms except the selected one
    const activatedTerms = await FYPterm.find({
      // Exclude the selected term
      status: "activated", // Filter only activated terms
    });

    console.log(
      "Consoling reqreq.query.selectedTermId.toString()",
      req.query.selectedTermId.toString()
    );

    console.log("Checking Activated Terms:", activatedTerms);

    // Find an activated term other than the selected one
    const otherActivatedTerm = activatedTerms.find(
      (term) => term._id.toString() !== req.query.selectedTermId.toString()
    );

    console.log(
      "Checking Other activated Term ID:",
      otherActivatedTerm ? otherActivatedTerm._id : null
    );

    if (otherActivatedTerm) {
      // If an activated term other than the selected one is found, return its ID
      const otherActivatedTermId = otherActivatedTerm._id;
      res.status(200).json({ otherActivatedTermId });
    } else {
      // If no other activated term is found, return an appropriate error message
      res.status(404).json({ message: "No other activated term found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchFYPTermCount = async (req, res) => {
  try {
    // Get the count of FYPTerm documents
    const fyptermCount = await FYPterm.countDocuments();

    // Return the FYPTerm count in the response
    res.status(200).json({ count: fyptermCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const deactivateTerm = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Find the term by ID and update its status to "Deactivated"
//     const updatedTerm = await FYPterm.findByIdAndUpdate(
//       id,
//       { status: "Deactivated" },
//       { new: true } // Return the updated document
//     );

//     if (!updatedTerm) {
//       return res.status(404).json({ message: "Term not found." });
//     }

//     res.status(200).json({ updatedTerm });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const deactivateTerm = async (req, res) => {
  console.log("Deactivated Term ");

  const { selectedTermId } = req.body;

  try {
    // Find the term by ID and update its status to "Deactivated"
    const updatedTerm = await FYPterm.findByIdAndUpdate(
      selectedTermId,
      { status: "Deactivated" },
      { new: true } // Return the updated document
    );

    if (!updatedTerm) {
      return res.status(404).json({ message: "Term not found." });
    }

    res.status(200).json({ updatedTerm });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteFYPterm = async (req, res) => {
  const { id } = req.params;
  const mongoose = require("mongoose");
  console.log("Inside deleteFYPterm controller for ID:", id);

  try {
    const termId = id;
    const termIds = [termId];
    const termConditions = [
      { term: termId },
      { "term._id": termId },
      { "term.termId": termId }
    ];

    if (mongoose.Types.ObjectId.isValid(termId)) {
      const termObjectId = new mongoose.Types.ObjectId(termId);
      termIds.push(termObjectId);
      termConditions.push(
        { term: termObjectId },
        { "term._id": termObjectId },
        { "term.termId": termObjectId }
      );
    }

    // 1. Find all FypRegistration groups belonging to this term
    const groups = await FypRegistration.find({ $or: termConditions });
    const groupIds = groups.map(g => g._id);

    console.log(`Found ${groupIds.length} groups to delete for term ${termId}`);

    // 2. Delete group-dependent records
    if (groupIds.length > 0) {
      await FYPGroupAttendance.deleteMany({ fypgroup: { $in: groupIds } });
      await ExamMarks.deleteMany({ groupId: { $in: groupIds } });
      await TaskAssignment.deleteMany({ groupId: { $in: groupIds } });
      await StudentReport.deleteMany({ FYPGroup: { $in: groupIds } });
      await FYPTopicChangeRequest.deleteMany({ groupId: { $in: groupIds } });
      await FYPTechnologyChangeRequest.deleteMany({ groupId: { $in: groupIds } });
      await FypChangeRequest.deleteMany({ fypGroup: { $in: groupIds } });
      await Feedback.deleteMany({ groupId: { $in: groupIds } });
    }

    // 3. Delete direct term-dependent records
    await GenUser.deleteMany({ role: "Student", term: { $in: termIds } });
    await FypRegistration.deleteMany({ $or: termConditions });
    await CreateExamModel.deleteMany({ Term: { $in: termIds } });
    await ExamAssignment.deleteMany({ termId: { $in: termIds } });
    await PanelDetails.deleteMany({ term: { $in: termIds } });
    await FYPRegistrationDeadline.deleteMany({ term: { $in: termIds } });
    await PassFailCriteria.deleteMany({ term: { $in: termIds } });
    await SupervisorPercentage.deleteMany({ term: { $in: termIds } });

    // 4. Pull/remove the term from terms arrays in Evaluations and Results
    await Evaluation.updateMany(
      { "terms.termId": { $in: termIds } },
      { $pull: { terms: { termId: { $in: termIds } } } }
    );
    await Result.updateMany(
      { "terms.termId": { $in: termIds } },
      { $pull: { terms: { termId: { $in: termIds } } } }
    );

    // 5. Finally, delete the term itself
    const deletedTerm = await FYPterm.findByIdAndDelete(termId);

    if (!deletedTerm) {
      return res.status(404).json({ message: "Term not found." });
    }

    console.log("Term and all associated data deleted successfully for ID:", termId);
    res.status(200).json({ message: "Term and all associated data deleted successfully." });
  } catch (error) {
    console.error("Error deleting term:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFYPterm,
  getTermData,
  updateFYPterm,
  findActivatedStatus,
  deactivateTerm,
  fetchFYPTermCount,
  getActivatedTermsForCheck,
  deleteFYPterm,
};
