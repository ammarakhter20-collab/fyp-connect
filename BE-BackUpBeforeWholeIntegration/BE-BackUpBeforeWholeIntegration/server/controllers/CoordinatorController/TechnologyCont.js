const Technology = require("../../models/CoordinatorModels/Technology");

// Controller function to add a new technology
exports.addTechnology = async (req, res) => {
  try {
    // Extract data from the request body
    const { techName, userId } = req.body;

    console.log("TechName", techName);
    console.log("UserId", userId);

    // Create a new technology instance
    const newTechnology = new Technology({
      techName,
      user: userId, // Assuming userId is provided in the request body
    });

    // Save the new technology to the database
    const savedTechnology = await newTechnology.save();

    // Return the saved technology in the response
    res.status(201).json(savedTechnology);
  } catch (error) {
    // Handle errors
    res.status(400).json({ message: error.message });
  }
};

exports.fetchTechnologies = async (req, res) => {
  console.log("inside fetch Technologies");
  try {
    // Fetch all technologies from the database
    const technologies = await Technology.find();

    // Return the fetched technologies in the response
    res.status(200).json(technologies);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};

exports.updateTech = async (req, res) => {
  console.log("Calledddddddddddddddddddddddddddd");
  try {
    // Extract technology ID and data from the request
    const { id } = req.params;
    const { techName, userId } = req.body;

    console.log("Updating Technology ID:", id);
    console.log("New TechName:", techName);
    console.log("New UserId:", userId);

    // Find the technology by ID and update it
    const updatedTechnology = await Technology.findByIdAndUpdate(
      id,
      { techName, user: userId },
      { new: true, runValidators: true }
    ).populate("user"); // Populate the user field to return user details

    // If the technology doesn't exist, return a 404 error
    if (!updatedTechnology) {
      return res.status(404).json({ message: "Technology not found" });
    }

    // Return the updated technology in the response
    res.status(200).json(updatedTechnology);
  } catch (error) {
    // Handle errors
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTech = async (req, res) => {
  try {
    // Extract technology ID from the request parameters
    const { id } = req.params;

    console.log("Deleting Technology ID:", id);

    // Find the technology by ID and delete it
    const deletedTechnology = await Technology.findByIdAndDelete(id);

    // If the technology doesn't exist, return a 404 error
    if (!deletedTechnology) {
      return res.status(404).json({ message: "Technology not found" });
    }

    // Return a success message in the response
    res.status(200).json({ message: "Technology deleted successfully" });
  } catch (error) {
    // Handle errors
    res.status(400).json({ message: error.message });
  }
};
