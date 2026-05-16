const TopicChangeRequest = require("../../models/StudentModels/TopicReqModel");
const FypRegistration = require("../../models/StudentModels/fypRegModel");

// Controller function to handle FYP change request creation

const deletePendingRequests = async () => {
  try {
    const pendingRequests = await TopicChangeRequest.find({
      status: "pending",
    });
    const currentTime = new Date();
    const deletionThreshold = new Date(currentTime - 24 * 60 * 60 * 1000); // 24 hours ago

    // Filter pending requests older than 24 hours
    const requestsToDelete = pendingRequests.filter(
      (request) => request.createdAt <= deletionThreshold
    );

    // Delete the filtered requests
    for (const request of requestsToDelete) {
      await request.remove();
      console.log("Pending request deleted:", request);
    }
  } catch (error) {
    console.error("Error deleting pending requests:", error);
  }
};

const createFYPTopicChangeRequest = async (req, res) => {
  console.log("FYP TOpic change req cont calledddd");
  try {
    const { user, groupId, fypTopic, newFypTopic, reasonForChange } = req.body;
    console.log("user", user);
    console.log("groupId", groupId);
    console.log("fypTopic", fypTopic);
    console.log("newFypTopic", newFypTopic);
    console.log("Reason", reasonForChange);

    // Create a new FYP change request
    const fypChangeRequest = new TopicChangeRequest({
      user,
      groupId,
      fypTopic,
      newFypTopic,
      reasonForChange,
    });

    // Save the new FYP change request to the database
    await fypChangeRequest.save();

    res.status(201).json(fypChangeRequest);
  } catch (error) {
    console.error("Error creating FYP change request:", error);
    res.status(500).json({ error: "Failed to create FYP change request" });
  }
};

const getFYPTopicReqByGroupId = async (req, res) => {
  console.log("Inside topic req exist");
  try {
    const groupId = req.params.id;
    console.log("Checking group id ", groupId);
    const fypTopicReq = await TopicChangeRequest.find({ groupId });

    if (!fypTopicReq || fypTopicReq.length === 0) {
      return res
        .status(404)
        .json({ error: "FYPTopicReq not found for the provided groupId" });
    }

    res.status(200).json(fypTopicReq);
  } catch (error) {
    console.error("Error fetching FYPTopicReq:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateTopicRequest = async (req, res) => {
  console.log("Inside update topic request controller");
  const { user, groupId, fypTopic, newFypTopic, reasonForChange } = req.body;
  const requestId = req.params.id; // Assuming the request ID is passed in the URL params
  console.log("Checking req id in update topic req", requestId);
  console.log("user", user);
  console.log("groupId", groupId);
  console.log("fypTopic", fypTopic);
  console.log("newFYPtopic", newFypTopic);
  console.log("reason", reasonForChange);

  try {
    // Find the request by ID
    const existingRequest = await TopicChangeRequest.findById(requestId);

    // Check if the request exists
    if (!existingRequest) {
      return res
        .status(404)
        .json({ message: "Topic change request not found." });
    }

    // Update the request with the new data
    existingRequest.user = user;
    existingRequest.groupId = groupId;
    existingRequest.fypTopic = fypTopic;
    existingRequest.newFypTopic = newFypTopic;
    existingRequest.reasonForChange = reasonForChange;

    // Save the updated request
    const updatedRequest = await existingRequest.save();

    // Return the updated request in the response
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("Error updating topic change request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all pending topic change requests for a specific supervisor
const getTopicReqsForSupervisor = async (req, res) => {
  console.log("Inside getTopicReqsForSupervisor");
  try {
    const supervisorId = req.params.supervisorId;
    console.log("Supervisor ID:", supervisorId);

    // Find all FYP registrations where the supervisor is the selectedOption
    const supervisorGroups = await FypRegistration.find({ selectedOption: supervisorId });
    const groupIds = supervisorGroups.map(g => g._id);

    if (groupIds.length === 0) {
      return res.status(200).json([]);
    }

    // Find all topic change requests for these groups
    const topicRequests = await TopicChangeRequest.find({
      groupId: { $in: groupIds },
    }).populate({
      path: "groupId",
      populate: [
        { path: "selectedOption", model: "GenUser" },
        { path: "selectedTechnology", model: "Technology" },
        { path: "selectedPlatform", model: "Platform" },
      ],
    }).populate({
      path: "user",
      model: "GenUser",
      select: "name registrationNumber email",
    });

    console.log(`Found ${topicRequests.length} topic change requests for supervisor`);
    res.status(200).json(topicRequests);
  } catch (error) {
    console.error("Error fetching topic requests for supervisor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Approve a topic change request - updates the topic in FYP registration
const approveTopicRequest = async (req, res) => {
  console.log("Inside approveTopicRequest");
  try {
    const requestId = req.params.id;
    const topicRequest = await TopicChangeRequest.findById(requestId);

    if (!topicRequest) {
      return res.status(404).json({ error: "Topic change request not found" });
    }

    // Update the topic change request status
    topicRequest.topicReqStatus = "approved";
    await topicRequest.save();

    // Update the FYP registration with the new topic
    const fypRegistration = await FypRegistration.findById(topicRequest.groupId);
    if (fypRegistration) {
      fypRegistration.topicData = {
        ...fypRegistration.topicData,
        topic: topicRequest.newFypTopic,
      };
      await fypRegistration.save();
      console.log("FYP Registration topic updated to:", topicRequest.newFypTopic);
    }

    res.status(200).json({
      message: "Topic change request approved and topic updated",
      topicRequest,
      updatedTopic: topicRequest.newFypTopic,
    });
  } catch (error) {
    console.error("Error approving topic request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reject a topic change request
const rejectTopicRequest = async (req, res) => {
  console.log("Inside rejectTopicRequest");
  try {
    const requestId = req.params.id;
    const { feedback } = req.body;

    const topicRequest = await TopicChangeRequest.findById(requestId);

    if (!topicRequest) {
      return res.status(404).json({ error: "Topic change request not found" });
    }

    topicRequest.topicReqStatus = "rejected";
    await topicRequest.save();

    res.status(200).json({
      message: "Topic change request rejected",
      topicRequest,
    });
  } catch (error) {
    console.error("Error rejecting topic request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createFYPTopicChangeRequest,
  getFYPTopicReqByGroupId,
  updateTopicRequest,
  deletePendingRequests,
  getTopicReqsForSupervisor,
  approveTopicRequest,
  rejectTopicRequest,
};
