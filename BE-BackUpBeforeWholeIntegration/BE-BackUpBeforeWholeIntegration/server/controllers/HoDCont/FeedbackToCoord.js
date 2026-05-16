const Feedback = require("../../models/HoDModels/FeedbackToCoordModel");

exports.createFeedback = async (req, res) => {
  console.log("Create Feedback function called");
  try {
    const {
      coordinator,
      feedbackBy,
      subject,
      description,
      departmentId,
      creationTime,
    } = req.body;

    console.log("coordinator", coordinator);
    console.log("feedbackBy", feedbackBy);
    console.log("subject", subject);
    console.log("Description", description);
    console.log("departmentId", departmentId); // Log the departmentId sent from the frontend

    // Parse creationTime to a Date object
    const parsedCreationTime = new Date(creationTime);

    // Check if parsedCreationTime is valid
    if (isNaN(parsedCreationTime)) {
      return res.status(400).json({ message: "Invalid creationTime format" });
    }

    // Create a new feedback instance
    const newFeedback = new Feedback({
      coordinator,
      feedbackBy,
      subject,
      description,
      department: departmentId, // Assign departmentId to the department field
      creationTime: parsedCreationTime, // Assign parsed creationTime
    });

    // Save the feedback to the database
    await newFeedback.save();

    res.status(201).json({ message: "Feedback created successfully" });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchFeedbacks = async (req, res) => {
  console.log("Fetch Feedbacks function called");
  try {
    const { departmentId } = req.params; // Extract departmentId from request parameters
    console.log("Department ID:", departmentId);

    // Fetch feedbacks based on departmentId and populate both the coordinator and feedbackBy fields
    const feedbacks = await Feedback.find({
      department: departmentId,
    })
      .populate("coordinator")
      .populate("feedbackBy");

    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteFeedback = async (req, res) => {
  console.log("Delete Feedback function called");
  try {
    const { feedbackId } = req.params; // Extract feedbackId from request parameters
    console.log("Feedback ID:", feedbackId);

    // Attempt to delete the feedback with the given feedbackId
    const result = await Feedback.findByIdAndDelete(feedbackId);

    // If no feedback is found with the given feedbackId
    if (!result) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Return a success response
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
