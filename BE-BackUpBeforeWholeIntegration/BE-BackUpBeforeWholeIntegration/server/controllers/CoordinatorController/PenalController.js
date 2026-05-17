const PanelDetails = require("../../models/CoordinatorModels/PenalModel");
const FYPTerm = require("../../models/AdminModels/fypTerm");
const FYPReg = require("../../models/StudentModels/fypRegModel");
const Evaluation = require("../../models/CoordinatorModels/EvaluateExamModel");
const CreateExam = require("../../models/CoordinatorModels/ExamCreationModel");
const ExamSchedule = require("../../models/CoordinatorModels/ExamScheduleModel");
const GenUser = require("../../models/AdminModels/GenUserModel"); // Adjust the path accordingly
const mongoose = require("mongoose");

// Controller logic for creating a new panel details record
const createPanelWithMembers = async (req, res) => {
  console.log("Panel Creation Calledddddddddddd");
  try {
    // Extract data from the request body
    const { department, term, panelCode, PanelMembers } = req.body;

    console.log("Department", department);
    console.log("Term", term);
    console.log("Panel Code", panelCode);
    console.log("Panel Members", PanelMembers);

    // Fetch the term label based on the term id
    const termData = await FYPTerm.findById(term);
    const termLabel = termData ? termData.sessionTerm : "";

    // Construct the panelName using the fetched term label and panelCode
    const panelName = `${termLabel}-${panelCode}`;

    // Set default role to "Examiner" if not provided by user
    const updatedPanelMembers = PanelMembers.map((memberObj) => ({
      member: memberObj.member?.value || memberObj.member, // Extract value if it exists, otherwise use member directly
      role: memberObj.role || "Examiner", // Set default role to "Examiner" if not provided
    }));

    // Create a new panel object
    const panel = new PanelDetails({
      department,
      term,
      panelCode,
      panelName,
      PanelMembers: updatedPanelMembers,
    });

    // Save the panel to the database
    await panel.save();

    // Return success response
    res.status(201).json({ message: "Panel created successfully", panel });
  } catch (error) {
    console.error("Error creating panel:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatePanelDetails = async (req, res) => {
  try {
    const { panelId } = req.params;
    const { department, term, panelCode, PanelMembers } = req.body;

    // Find the panel by ID
    const panel = await PanelDetails.findById(panelId);

    if (!panel) {
      return res.status(404).json({ error: "Panel not found" });
    }

    // Update the panel details with the new data
    if (department) panel.department = department;
    if (term) panel.term = term;
    if (panelCode) panel.panelCode = panelCode;

    // Fetch the term label based on the term id if term is updated
    if (term) {
      const termData = await FYPTerm.findById(term);
      const termLabel = termData ? termData.sessionTerm : "";
      panel.panelName = `${termLabel}-${panelCode}`;
    }

    // Update panel members if provided
    if (PanelMembers && Array.isArray(PanelMembers)) {
      panel.PanelMembers = PanelMembers.map((memberObj) => ({
        member: new mongoose.Types.ObjectId(memberObj.member), // Convert member to ObjectId
        role: memberObj.role || "Examiner", // Set default role if not provided
      }));
    } else {
      // Handle case where PanelMembers is not provided or is not an array
      panel.PanelMembers = [];
    }

    // Save the updated panel to the database
    await panel.save();

    // Return success response
    res
      .status(200)
      .json({ message: "Panel details updated successfully", panel });
  } catch (error) {
    console.error("Error updating panel details:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllPanels = async (req, res) => {
  try {
    // Fetch all panels from the database
    const panels = await PanelDetails.find()
      .populate({
        path: "PanelMembers.member",
        populate: {
          path: "department",
          // populate: {
          //   path: "term",
          // },
        },
      })
      .populate("term")
      .populate("department");

    // Return the fetched panels
    res.status(200).json({ panels });
  } catch (error) {
    console.error("Error fetching panels:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const assignRole = async (req, res) => {
  try {
    // Extract supervisor ID, role, and panel ID from the request body
    const { supervisorId, role, panelId } = req.body;

    // Find the panel by ID
    const panel = await PanelDetails.findById(panelId);

    if (!panel) {
      return res.status(404).json({ error: "Panel not found" });
    }

    // Find the panel member with the given supervisor ID
    const panelMember = panel.PanelMembers.find(
      (member) => member.member.toString() === supervisorId
    );

    if (!panelMember) {
      return res
        .status(404)
        .json({ error: "Supervisor not found in the panel" });
    }

    // Update the role of the panel member
    panelMember.role = role;

    // Save the updated panel to the database
    await panel.save();

    // Return success response
    res.status(200).json({ message: "Role assigned successfully", panel });
  } catch (error) {
    console.error("Error assigning role:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const addFacultyMember = async (req, res) => {
  console.log("Add Faculty Member controller function calledddddddd");
  try {
    // Extract panel ID and faculty member details from the request body
    const { panelId, member } = req.body;
    console.log("panelID", panelId);
    console.log("member", member);

    // Find the panel by ID
    const panel = await PanelDetails.findById(panelId);

    if (!panel) {
      return res.status(404).json({ error: "Panel not found" });
    }

    // Check if the member already exists in the panel
    const existingMember = panel.PanelMembers.find(
      (panelMember) => panelMember.member.toString() === member
    );

    if (existingMember) {
      return res
        .status(400)
        .json({ error: "Member already exists in the panel" });
    }

    // Add the new faculty member to the PanelMembers array
    panel.PanelMembers.push({ member });

    // Save the updated panel to the database
    await panel.save();

    // Return success response
    res
      .status(201)
      .json({ message: "Faculty member added successfully", panel });
  } catch (error) {
    console.error("Error adding faculty member:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const deletePanel = async (req, res) => {
  console.log("Delete panel calledddddddddddddddddddddddddddddddddddd");
  try {
    // Extract panel ID from request parameters
    const { panelId } = req.params;
    console.log("panelId");

    // Find the panel by ID and delete it
    const deletedPanel = await PanelDetails.findByIdAndDelete(panelId);

    if (!deletedPanel) {
      return res.status(404).json({ error: "Panel not found" });
    }

    // Return success response
    res.status(200).json({ message: "Panel deleted successfully" });
  } catch (error) {
    console.error("Error deleting panel:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

// const countExaminerPanels = async (req, res) => {
//   try {
//     // Count the total number of panels in the PanelDetails collection
//     const totalPanels = await PanelDetails.countDocuments();

//     // Return the total count
//     res.status(200).json({ totalPanels });
//   } catch (error) {
//     console.error("Error counting panels:", error);
//     // Return error response
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const countExaminerPanels = async (req, res) => {
  const { depId } = req.params;

  if (!depId) {
    return res.status(400).json({ error: "depId parameter is required" });
  }

  try {
    // Count the total number of panels with the matching departmentId
    const totalPanels = await PanelDetails.countDocuments({
      department: depId,
    });

    // Return the total count
    res.status(200).json({ totalPanels });
  } catch (error) {
    console.error("Error counting panels:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

// const getPanelDetailsByUserId = async (req, res) => {
//   try {
//     const { userid: userId } = req.params;
//     // console.log(userId);
//     const panels = await PanelDetails.find({
//       "members.member": userId,
//     }).populate({
//       path: "members.member",
//       populate: {
//         path: "department",
//       },
//     });
//     res.status(200).json({ panels });
//   } catch (err) {
//     console.error("Error creating task assignment:", error);

//     res.status(400).json({ success: false, error: err.message });
//   }
// };

const getPanelDetailsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId, "outpotted");
    const panels = await PanelDetails.find({
      "PanelMembers.member": userId,
    })
      .populate({
        path: "PanelMembers.member",
        model: "GenUser",
        populate: {
          path: "department",
        },
      })
      .populate("department")
      .populate("term");
    res.status(200).json({ panels });
  } catch (err) {
    console.error("Error creating task assignment:", error);

    res.status(400).json({ success: false, error: err.message });
  }
};

const assignPanel = async (req, res) => {
  try {
    // Extract panel ID and FYP registration ID from the request body
    const { panelId, registrationId } = req.body;

    // Find the FYP registration by ID
    const registration = await FYPReg.findById(registrationId);

    if (!registration) {
      return res.status(404).json({ error: "FYP registration not found" });
    }

    // Update the FYP registration with the assigned panel details
    registration.assignedPanel = panelId;

    // Save the updated FYP registration to the database
    await registration.save();

    // Return success response
    res.status(200).json({
      message: "Panel assigned to FYP registration successfully",
      registration,
    });
  } catch (error) {
    console.error("Error assigning panel to FYP registration:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPanelById = async (req, res) => {
  console.log("inside get panel Details by Id");
  try {
    const { panelId } = req.params;
    console.log("Checking Panel id", panelId);
    console.log("Logging req params", req.params);

    const panel = await PanelDetails.findById(panelId).populate({
      path: "PanelMembers.member",
      populate: {
        path: "department",
        populate: {
          path: "term",
        },
      },
    });

    res.status(200).json({ panel });
  } catch (err) {
    console.error("Error fetching panel details:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

const deleteParticularPanelMember = async (req, res) => {
  try {
    // Extract panel ID and member ID from request body
    const { panelId, memberId } = req.params;
    console.log("Checking PanelID", panelId);
    console.log("Checking MemberId", memberId);

    // Find the panel by ID
    const panel = await PanelDetails.findById(panelId);

    // Check if the panel exists
    if (!panel) {
      return res.status(404).json({ error: "Panel not found" });
    }

    // Find the index of the member in the PanelMembers array
    const memberIndex = panel.PanelMembers.findIndex(
      (member) => member.member.toString() === memberId
    );

    // If member is not found, return error
    if (memberIndex === -1) {
      return res.status(404).json({ error: "Panel member not found" });
    }

    // Remove the member from the PanelMembers array
    panel.PanelMembers.splice(memberIndex, 1);

    // Save the updated panel
    await panel.save();

    // Return success response
    res
      .status(200)
      .json({ message: "Panel member deleted successfully", panel });
  } catch (error) {
    console.error("Error deleting panel member:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkPanelAssigned = async (req, res) => {
  try {
    // Extract groupId from request parameters
    const { groupId } = req.params;
    console.log("GroupID", groupId);
    // Find the FYP registration by ID
    const registration = await FYPReg.findById(groupId);

    if (!registration) {
      return res.status(404).json({ error: "FYP registration not found" });
    }

    // Check if the assignedPanel field is set or not
    if (registration.assignedPanel) {
      return res.status(200).json({ isPanelAssigned: true });
    } else {
      return res.status(200).json({ isPanelAssigned: false });
    }
  } catch (error) {
    console.error("Error checking panel assignment:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEvaluationStatusByPanel = async (req, res) => {
  const { termId, examName } = req.params;
  const statusFilter = req.query.status;

  try {
    const termData = await FYPTerm.findById(termId);
    const termName = termData ? termData.sessionTerm : "Unknown Term";

    const allEvals = await Evaluation.find({ "terms.termId": termId });
    const groupsMap = {};

    for (const evalDoc of allEvals) {
      const termDoc = evalDoc.terms.find(t => t.termId.toString() === termId);
      if (!termDoc) continue;

      const examDoc = termDoc.exams.find(e => e.examName === examName);
      if (!examDoc) continue;

      for (const group of examDoc.fypGroups) {
        if (!groupsMap[group.groupId.toString()]) {
          const reg = await FYPReg.findById(group.groupId);
          const panel = await PanelDetails.findById(group.panelId).populate("PanelMembers.member");
          
          let evaluators = [];
          if (panel) {
             evaluators = panel.PanelMembers.map(pm => ({
               evaluatorId: pm.member._id,
               evaluatorName: pm.member.name,
               evaluationStatus: "pending"
             }));
          }

          let examDateStr = "N/A";
          const schedule = await ExamSchedule.findOne({ panel: group.panelId, CreatedExam: examDoc.examId });
          if (schedule && schedule.ExamDate) {
             examDateStr = new Date(schedule.ExamDate).toLocaleDateString('en-GB');
          }

          groupsMap[group.groupId.toString()] = {
            groupId: group.groupId,
            groupName: reg ? (reg.topicData?.title || reg.topicData?.topicTitle || reg.topicData?.topic || "N/A") : "N/A",
            examName: examName,
            termName: termName,
            termId: termId,
            examDate: examDateStr,
            evaluators: evaluators
          };
        }

        // Check marking
        for (const student of group.students) {
          for (const examinerMark of student.evaluationsByExaminers) {
             const ev = groupsMap[group.groupId.toString()].evaluators.find(e => e.evaluatorId.toString() === examinerMark.examinerId.toString());
             if (ev) ev.evaluationStatus = "completed";
          }
        }
      }
    }

    let results = Object.values(groupsMap);
    if (statusFilter) {
       results = results.filter(g => {
          if (statusFilter === 'completed') {
             return g.evaluators.every(e => e.evaluationStatus === 'completed') && g.evaluators.length > 0;
          } else {
             return g.evaluators.some(e => e.evaluationStatus === 'pending') || g.evaluators.length === 0;
          }
       });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching evaluation status:", error);
    res.status(500).json({ message: "Error fetching evaluation status" });
  }
};

const getEvaluationStatofAllexm = async (req, res) => {
  try {
    const examsQuery = req.query.exams;
    if (!examsQuery) return res.status(200).json([]);
    
    const parsedExams = examsQuery.split('|').map(str => JSON.parse(decodeURIComponent(str)));
    const allResults = [];

    for (const reqExam of parsedExams) {
      const termId = reqExam.termId;
      const examName = reqExam.examName;
      
      const termData = await FYPTerm.findById(termId);
      const termName = termData ? termData.sessionTerm : "Unknown Term";

      const allEvals = await Evaluation.find({ "terms.termId": termId });
      const groupsMap = {};

      for (const evalDoc of allEvals) {
        const termDoc = evalDoc.terms.find(t => t.termId.toString() === termId);
        if (!termDoc) continue;
        const examDoc = termDoc.exams.find(e => e.examName === examName);
        if (!examDoc) continue;

        for (const group of examDoc.fypGroups) {
          if (!groupsMap[group.groupId.toString()]) {
            const reg = await FYPReg.findById(group.groupId);
            const panel = await PanelDetails.findById(group.panelId).populate("PanelMembers.member");
            
            let evaluators = [];
            if (panel) {
               evaluators = panel.PanelMembers.map(pm => ({
                 evaluatorId: pm.member._id,
                 evaluatorName: pm.member.name,
                 evaluationStatus: "pending"
               }));
            }

            let examDateStr = "N/A";
            const schedule = await ExamSchedule.findOne({ panel: group.panelId, CreatedExam: examDoc.examId });
            if (schedule && schedule.ExamDate) {
               examDateStr = new Date(schedule.ExamDate).toLocaleDateString('en-GB');
            }

            groupsMap[group.groupId.toString()] = {
              groupId: group.groupId,
              groupName: reg ? (reg.topicData?.title || reg.topicData?.topicTitle || reg.topicData?.topic || "N/A") : "N/A",
              examDate: examDateStr,
              evaluators: evaluators
            };
          }

          for (const student of group.students) {
            for (const examinerMark of student.evaluationsByExaminers) {
               const ev = groupsMap[group.groupId.toString()].evaluators.find(e => e.evaluatorId.toString() === examinerMark.examinerId.toString());
               if (ev) ev.evaluationStatus = "completed";
            }
          }
        }
      }

      const groupsArray = Object.values(groupsMap);
      if (groupsArray.length > 0) {
        allResults.push({
          examName: examName,
          termName: termName,
          termId: termId,
          groups: groupsArray
        });
      }
    }

    res.status(200).json(allResults);
  } catch (error) {
    console.error("Error in getEvaluationStatofAllexm:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeFacultyMember = async (req, res) => {
  try {
    // Extract panel ID and faculty member ID from request parameters
    const { panelId, facultyMemberId } = req.params;
    console.log("Remove Faculty Member Called");
    console.log("panelIddddddddddddd", panelId);
    console.log("FacultymemberIddddddddd", facultyMemberId);

    // Find the panel by ID
    const panel = await PanelDetails.findById(panelId);

    if (!panel) {
      return res.status(404).json({ error: "Panel not found" });
    }

    // Check if the faculty member exists in the panel's PanelMembers array
    const memberIndex = panel.PanelMembers.findIndex(
      (member) => member.member.toString() === facultyMemberId
    );

    if (memberIndex === -1) {
      return res
        .status(404)
        .json({ error: "Faculty member not found in the panel" });
    }

    // Remove the faculty member from the PanelMembers array
    panel.PanelMembers.splice(memberIndex, 1);

    // Save the updated panel to the database
    await panel.save();

    // Return success response
    res.status(200).json({
      message: "Faculty member removed from panel successfully",
      panel,
    });
  } catch (error) {
    console.error("Error removing faculty member from panel:", error);
    // Return error response
    res.status(500).json({ error: "Internal server error" });
  }
};

// Stub to prevent frontend crash
const getEvaluationStatofexminer = async (req, res) => {
  try {
    const { termId, examId } = req.params;
    const { groupId, examinerId } = req.query;

    console.log("getEvaluationStatofexminer Called for Examiner:", examinerId);
    console.log("Term:", termId, "Exam:", examId, "Group:", groupId);

    // Find the evaluation for the specified term and exam
    const evaluation = await Evaluation.findOne({
      "terms.termId": termId,
      "terms.exams.examId": examId,
    });

    if (!evaluation) {
      // No evaluation record at all -> Not marked
      return res.status(200).json({ evaluationStatus: "pending" });
    }

    const termDoc = evaluation.terms.find((t) => t.termId.toString() === termId);
    if (!termDoc) return res.status(200).json({ evaluationStatus: "pending" });

    const examDoc = termDoc.exams.find((e) => e.examId.toString() === examId);
    if (!examDoc) return res.status(200).json({ evaluationStatus: "pending" });

    const groupDoc = examDoc.fypGroups.find((g) => g.groupId.toString() === groupId);
    if (!groupDoc) return res.status(200).json({ evaluationStatus: "pending" });

    // Check if THIS examiner has marked ANY student in this group
    const hasMarked = groupDoc.students.some((student) => {
      return student.evaluationsByExaminers.some(
        (eval) => eval.examinerId.toString() === examinerId
      );
    });

    if (hasMarked) {
      console.log("Examiner has already marked this group.");
      return res.status(200).json({ evaluationStatus: "completed" });
    } else {
      console.log("Examiner has NOT marked this group yet.");
      return res.status(200).json({ evaluationStatus: "pending" });
    }

  } catch (error) {
    console.error("Error in getEvaluationStatofexminer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ============================================================================
// GET GROUPS FOR PANEL ASSIGNMENT
// Fetches all accepted FYP groups for a given term, showing their current panel
// ============================================================================
const getGroupsForPanelAssignment = async (req, res) => {
  try {
    const { termId } = req.query;
    if (!termId) {
      return res.status(400).json({ error: "termId query parameter is required" });
    }

    console.log("[getGroupsForPanelAssignment] termId:", termId);

    const termObjectId = new mongoose.Types.ObjectId(termId);

    // Fetch all accepted FYP registrations for this term
    const groups = await FYPReg.find({
      $or: [
        { term: termObjectId },
        { term: termId }
      ],
      reqStatus: { $in: ["approved", "Accepted", "accepted"] }
    })
      .populate({ path: "selectedOption", model: "GenUser", select: "name" })
      .populate({ path: "assignedPanel", model: "PanelDetails", select: "panelName panelCode" })
      .exec();

    console.log(`[getGroupsForPanelAssignment] Found ${groups.length} groups`);

    const result = groups.map((g) => ({
      groupId: g._id,
      topicName: g.topicData?.topic || "N/A",
      supervisorName: g.selectedOption?.name || "N/A",
      memberCount: g.groupMembers?.length || 0,
      members: (g.groupMembers || []).map((m) => ({
        name: m.name,
        regNum: m.registrationNumber,
      })),
      currentPanel: g.assignedPanel
        ? {
            panelId: g.assignedPanel._id,
            panelName: g.assignedPanel.panelName || g.assignedPanel.panelCode || "Unknown",
          }
        : null,
    }));

    // Also fetch all panels for this term so the frontend can show a dropdown
    const panels = await PanelDetails.find({ term: termObjectId })
      .populate({ path: "PanelMembers.member", model: "GenUser", select: "name" })
      .exec();

    const panelOptions = panels.map((p) => ({
      panelId: p._id,
      panelName: p.panelName || p.panelCode,
      members: p.PanelMembers.map((pm) => pm.member?.name || "Unknown"),
    }));

    res.status(200).json({ groups: result, panels: panelOptions });
  } catch (error) {
    console.error("Error in getGroupsForPanelAssignment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ============================================================================
// UNASSIGN PANEL
// Removes the panel assignment from a specific FYP group
// ============================================================================
const unassignPanel = async (req, res) => {
  try {
    const { registrationId } = req.body;
    if (!registrationId) {
      return res.status(400).json({ error: "registrationId is required" });
    }

    const registration = await FYPReg.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ error: "FYP registration not found" });
    }

    registration.assignedPanel = null;
    await registration.save();

    res.status(200).json({
      message: "Panel unassigned successfully",
      registration,
    });
  } catch (error) {
    console.error("Error unassigning panel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Other controller methods for updating, deleting, and fetching panel details

module.exports = {
  createPanelWithMembers,
  updatePanelDetails,
  getPanelDetailsByUserId,
  getPanelById,
  getAllPanels,
  assignRole,
  addFacultyMember,
  deletePanel,
  assignPanel,
  deleteParticularPanelMember,
  countExaminerPanels,
  checkPanelAssigned,
  getEvaluationStatusByPanel,
  removeFacultyMember,
  getEvaluationStatofexminer,
  getEvaluationStatofAllexm,
  getGroupsForPanelAssignment,
  unassignPanel,
};
