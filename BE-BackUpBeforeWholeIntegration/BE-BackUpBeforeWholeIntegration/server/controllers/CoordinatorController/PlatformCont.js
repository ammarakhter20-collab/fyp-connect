const Platform = require("../../models/CoordinatorModels/PlatformModel");

// Controller function for adding a platform
exports.addPlatform = async (req, res) => {
  try {
    // Extract data from the request body
    const { platformName, userId } = req.body;

    // Create a new platform instance
    const newPlatform = new Platform({
      platformName,
      user: userId, // Assuming userId is provided in the request body
    });

    // Save the new platform to the database
    const savedPlatform = await newPlatform.save();

    // Return the saved platform in the response
    res.status(201).json(savedPlatform);
  } catch (error) {
    // Handle errors
    res.status(400).json({ message: error.message });
  }
};

// Controller function for fetching all platforms
exports.fetchPlatforms = async (req, res) => {
  try {
    // Fetch all platforms from the database
    const platforms = await Platform.find();

    // Return the fetched platforms in the response
    res.status(200).json(platforms);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};

exports.updatePlatform = async (req, res) => {
  console.log("Update Platform Called");
  try {
    // Extract platform ID from the request parameters
    const { platformId } = req.params;

    // Extract data to be updated from the request body
    const { platformName, userId } = req.body;

    // Find the platform by ID and update it with the new data
    const updatedPlatform = await Platform.findByIdAndUpdate(
      platformId,
      { platformName, user: userId },
      { new: true } // This option returns the modified document
    );

    if (!updatedPlatform) {
      return res.status(404).json({ message: "Platform not found" });
    }

    // Return the updated platform in the response
    res.status(200).json(updatedPlatform);
  } catch (error) {
    // Handle errors
    res.status(400).json({ message: error.message });
  }
};

exports.deletePlatform = async (req, res) => {
  try {
    // Extract platform ID from the request parameters
    const { platformId } = req.params;

    // Find the platform by ID and delete it
    const deletedPlatform = await Platform.findByIdAndDelete(platformId);

    if (!deletedPlatform) {
      return res.status(404).json({ message: "Platform not found" });
    }

    // Return a success message
    res.status(200).json({ message: "Platform deleted successfully" });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};
