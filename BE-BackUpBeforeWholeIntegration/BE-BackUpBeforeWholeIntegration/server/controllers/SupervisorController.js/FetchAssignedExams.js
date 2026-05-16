const FypRegistration = require("../../models/StudentModels/fypRegModel"); // Adjust the path as needed
const PanelDetails = require("../../models/CoordinatorModels/PenalModel"); // Adjust the path as needed

const getFypRegistrationsByPanelMember = async (req, res) => {
  console.log("Function Called");
  const { userId } = req.params;
  console.log("Checking User Id", userId);

  try {
    // Step 1: Fetch all FypRegistrations where assignedPanel contains the userId
    const fypRegistrations = await FypRegistration.find()
      .populate({
        path: "assignedPanel",
        populate: {
          path: "PanelMembers.member",
          model: "GenUser",
        },
      })
      .populate("selectedOption")
      .populate("term")
      .populate({
        path: "groupMembers",
        populate: {
          path: "program",
          model: "Program",
        },
      });

    console.log("Checking fypRegistrations:", fypRegistrations);

    // Step 2: Retrieve the assignedPanel IDs from the fetched documents
    const panelIds = fypRegistrations
      .filter(
        (fyp) => {
          // Debug log for each FYP check
          const hasPanel = fyp.assignedPanel && fyp.assignedPanel.PanelMembers;
          if (!hasPanel) return false;

          const isMember = fyp.assignedPanel.PanelMembers.some(
            (member) => {
              const mId = member.member && member.member._id ? member.member._id.toString() : (member.member ? member.member.toString() : null);
              return mId === userId;
            }
          );
          return isMember;
        }
      )
      .map((fyp) => fyp.assignedPanel._id);

    console.log("Found Panel IDs matching user:", panelIds);

    // Step 3: Filter the fetched groups based on whether selectedOption matches the userId
    const asSupervisor = [];
    const asExaminer = [];

    fypRegistrations.forEach((fyp) => {
      // Log to see why it might fail
      // console.log("Checking FYP:", fyp._id, "Panel:", fyp.assignedPanel?._id);

      if (
        fyp.assignedPanel &&
        panelIds.some(
          (id) => id.toString() === fyp.assignedPanel._id.toString()
        )
      ) {
        if (fyp.selectedOption && fyp.selectedOption._id.toString() === userId) {
          asSupervisor.push(fyp);
        } else {
          asExaminer.push(fyp);
        }
      }
    });

    // Return the matching and non-matching groups
    console.log(`Found ${asSupervisor.length} supervisor exams and ${asExaminer.length} examiner exams.`);
    res.status(200).json({ asSupervisor, asExaminer });
  } catch (error) {
    console.error("Error fetching FypRegistrations by panel member:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getFypRegistrationsByPanelMember,
};
