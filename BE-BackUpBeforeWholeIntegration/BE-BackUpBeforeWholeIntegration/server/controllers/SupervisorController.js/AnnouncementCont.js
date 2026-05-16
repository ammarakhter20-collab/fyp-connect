const mongoose = require("mongoose");
const Announcement = require("../../models/SupervisorModels/AnnouncementModel");
const User = require("../../models/AdminModels/GenUserModel");

const createAnnouncement = async (req, res) => {
  const { userid: userId } = req.params;
  const { newTitle, newDesc, newForPart } = req.body;

  // Check if a file was uploaded
  let filePath = null;
  if (req.file) {
    // Assuming you're storing the file path in the database
    filePath = req.file.path;
  }

  // console.log(req.body.announcement, "received");
  // console.log(userId, "received");
  // console.log("Checking file", filePath);
  try {
    const newAnnouncement = new Announcement({
      title: newTitle,
      announcement: newDesc,
      forPart: newForPart,
      uploadedBy: new mongoose.Types.ObjectId(userId),
      filePath: filePath, // Add file path to the announcement
    });

    await newAnnouncement.save();

    res.status(201).json({ message: "Announcement created successfully" });
  } catch (error) {
    console.error("Error creating announcement:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAnnouncement = async (req, res) => {
  const userId = req.params.userid;
  // console.log(userId);
  try {
    var announcement;
    if (userId) {
      announcement = await Announcement.find({ uploadedBy: userId });
    } else {
      announcement = await Announcement.find({ uploadedBy: { $ne: userId } });
    }
    if (!announcement || announcement.length === 0) {
      return res.status(404).json({ message: "Announcements not found" });
    }
    res.status(200).json({ announcement });
  } catch (error) {
    console.error("Error fetching announcement data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const getAnnouncementByPartStatus = async (req, res) => {
//   const partStatus = req.params.partstatus; // Get partStatus from query params
//   console.log("Checking part status", partStatus);

//   try {
//     let announcement;
//     // If partStatus is provided, filter announcements by partStatus and uploadedBy
//     announcement = await Announcement.find({
//       forPart: { $in: [partStatus, "all"] },
//     }).populate("uploadedBy");

//     if (!announcement || announcement.length === 0) {
//       return res.status(404).json({ message: "Announcements not found" });
//     }
//     res.status(200).json({ announcement });
//   } catch (error) {
//     console.error("Error fetching announcement data:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const getAnnouncementByPartStatus = async (req, res) => {
  console.log("Inside Get Annnouncement by partStatus");
  let { supervisorId, coordinatorId, partstatus } = req.params;
  // console.log("Supervisor Id", supervisorId);
  // console.log("Coordinator Id", coordinatorId);
  // console.log("partStatus", partstatus);
  supervisorId = supervisorId.trim();
  coordinatorId = coordinatorId.trim();

  try {
    let announcement;

    // Construct the query object to filter announcements
    const query = {
      forPart: partstatus,
      uploadedBy: { $in: [supervisorId, coordinatorId] },
    };

    // Find announcements based on the constructed query
    announcement = await Announcement.find(query).populate("uploadedBy");

    if (!announcement || announcement.length === 0) {
      return res.status(404).json({ message: "Announcements not found" });
    }

    // Return the announcements in the response
    res.status(200).json({ announcement });
  } catch (error) {
    console.error("Error fetching announcement data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//MOST IMP QUERY!!! DON'T Forget
//       const filteredFyps = registeredfyps.filter(request => request.selectedOption._id.toString() === userId);

const updateAnnouncement = async (req, res) => {
  const userId = req.params.userid;
  const {
    title: newTitle,
    decription: newDescription,
    file: newFile,
    id: annid,
  } = req.body.announcement;
  // console.log("STATUS", userId);
  // console.log("Announcement", annid);
  const currentDate = new Date(); // Get the current date

  try {
    const updatedRequest = await Announcement.findByIdAndUpdate(
      annid,
      {
        title: newTitle,
        announcement: newDescription,
        file: newFile,
        createdAt: currentDate, // Update the updatedAt field with the current date
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    console.log("UPDATED");

    res.status(200).json({ updatedRequest });
  } catch (error) {
    console.error("Error updating Announcement:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncement,
  updateAnnouncement,
  getAnnouncementByPartStatus,
};
