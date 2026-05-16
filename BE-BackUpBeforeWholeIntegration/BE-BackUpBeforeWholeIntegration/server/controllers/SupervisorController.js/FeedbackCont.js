const Feedback = require("../../models/SupervisorModels/FeedbackModel");

// Controller function to create feedback

exports.fetchFeedback = async (req, res) => {
  console.log("Inside fetch feedback Controller");
  try {
    // Extract group ID from request parameters
    const groupId = req.query.groupId;

    console.log("Checking group id", groupId);

    // Find feedback documents based on group ID
    const feedback = await Feedback.find({ groupId });

    // Check if feedback exists for the provided group ID
    if (!feedback || feedback.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found for the specified group ID",
      });
    }

    // Send success response with the feedback data
    res.status(200).json({ feedback });
  } catch (error) {
    // Handle error
    console.error("Error fetching feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
};

exports.deleteFeedbackOfGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    console.log("Deletttttttttte Feedback Func Called");

    const feedback = await Feedback.find({ groupId });

    if (!feedback || feedback.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found for the specified group ID",
      });
    }

    await Feedback.deleteMany({ groupId });

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
      error: error.message,
    });
  }
};

// exports.createFeedback = async (req, res) => {
//   try {
//     // Extract feedback data from request body
//     const { feedback, groupId } = req.body;

//     // Create new feedback document
//     const newFeedback = new Feedback({
//       feedback,
//       groupId,
//       // Add other fields as needed
//     });

//     // Save the feedback document to the database
//     await newFeedback.save();

//     // Send success response
//     res.status(201).json({
//       feedback: newFeedback,
//     });
//   } catch (error) {
//     // Handle error
//     console.error("Error creating feedback:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create feedback",
//       error: error.message,
//     });
//   }
// };

exports.createFeedback = async (req, res) => {
  try {
    // Extract feedback data from request body
    const { feedback, groupId } = req.body;

    // Check for existing feedback documents based on group ID
    const existingFeedback = await Feedback.find({ groupId });

    // If existing feedback is found, delete it
    if (existingFeedback && existingFeedback.length > 0) {
      await Feedback.deleteMany({ groupId });
    }

    // Create new feedback document
    const newFeedback = new Feedback({
      feedback,
      groupId,
    });

    // Save the new feedback document to the database
    await newFeedback.save();

    // Send success response
    res.status(201).json({
      success: true,
      feedback: newFeedback,
    });
  } catch (error) {
    // Handle error
    console.error("Error creating feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create feedback",
      error: error.message,
    });
  }
};
exports.AddFeedback = async (groupId, feedback) => {
  try {
    // Extract feedback data from request body
    // const { feedback, groupId } = req.body;

    // Check for existing feedback documents based on group ID
    const existingFeedback = await Feedback.find({ groupId });

    // If existing feedback is found, delete it
    if (existingFeedback && existingFeedback.length > 0) {
      await Feedback.deleteMany({ groupId });
    }

    // Create new feedback document
    const newFeedback = new Feedback({
      feedback,
      groupId,
    });

    // Save the new feedback document to the database
    await newFeedback.save();

    // Send success response
    res.status(201).json({
      success: true,
      feedback: newFeedback,
    });
  } catch (error) {
    // Handle error
    console.error("Error creating feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create feedback",
      error: error.message,
    });
  }
};
