const FYPTechnologyChangeRequest = require("../../models/StudentModels/TechReqModel");

// Controller function to create a new FYPTechnologyChangeRequest
const createFYPTechnologyChangeRequest = async (req, res) => {
  console.log("I am inside tech req controller");
  console.log("I am inside tech req controller");
  console.log("I am inside tech req controller");
  console.log("I am inside tech req controller");
  try {
    const { user, groupId, fypTechnology, newFypTechnology, reasonForChange } =
      req.body;

    // Create a new FYPTechnologyChangeRequest object
    const fypTechChangeRequest = new FYPTechnologyChangeRequest({
      user,
      groupId,
      fypTechnology,
      newFypTechnology,
      reasonForChange,
    });

    // Save the FYPTechnologyChangeRequest to the database
    const savedRequest = await fypTechChangeRequest.save();

    res.status(201).json(savedRequest); // Return the created FYPTechnologyChangeRequest
  } catch (error) {
    console.error("Error creating FYPTechnologyChangeRequest:", error);
    res
      .status(500)
      .json({ error: "Failed to create FYPTechnologyChangeRequest." });
  }
};

// controllers/fypTechnologyReqController.js

// Controller function to fetch FYPTechnologyReq based on groupId
const getFYPTechnologyReqByGroupId = async (req, res) => {
  console.log("Inside tech req exist");
  try {
    const groupId = req.params.id;
    console.log("Checking group id ", groupId);
    const fypTechnologyReq = await FYPTechnologyChangeRequest.find({ groupId });

    if (!fypTechnologyReq || fypTechnologyReq.length === 0) {
      return res
        .status(404)
        .json({ error: "FYPTechnologyReq not found for the provided groupId" });
    }

    res.status(200).json(fypTechnologyReq);
  } catch (error) {
    console.error("Error fetching FYPTechnologyReq:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateTechnologyRequest = async (req, res) => {
  console.log("Inside update technology request controller");
  const { user, groupId, fypTechnology, newFypTechnology, reasonForChange } =
    req.body;
  const requestId = req.params.id; // Assuming the request ID is passed in the URL params
  console.log("Checking req id in update tech req", requestId);

  try {
    // Find the request by ID
    const existingRequest = await FYPTechnologyChangeRequest.findById(
      requestId
    );

    // Check if the request exists
    if (!existingRequest) {
      return res
        .status(404)
        .json({ message: "Technology change request not found." });
    }

    // Update the request with the new data
    existingRequest.user = user;
    existingRequest.groupId = groupId;
    existingRequest.fypTechnology = fypTechnology;
    existingRequest.newFypTechnology = newFypTechnology;
    existingRequest.reasonForChange = reasonForChange;

    // Save the updated request
    const updatedRequest = await existingRequest.save();

    // Return the updated request in the response
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("Error updating technology change request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createFYPTechnologyChangeRequest,
  getFYPTechnologyReqByGroupId,
  updateTechnologyRequest,
};
