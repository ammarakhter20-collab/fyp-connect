const Announcement = require("../../models/CoordinatorModels/CoordAnnouncement");

// Create Announcement
exports.createAnnouncement = async (req, res) => {
  console.log("inside Create Announcement for Coordinator");
  console.log("inside Create Announcement for Coordinator");
  console.log("inside Create Announcement for Coordinator");
  try {
    const { announFor, title, description, role } = req.body;
    const file = req.file ? req.file.path : null; // Get the file path
    const { userId } = req.params;

    console.log("Announ for", announFor);
    console.log("Title", title);
    console.log("Description", description);
    console.log("File", file);
    console.log("Uploaded By", userId);
    console.log("Role", role);
    const uploadedBy = userId;

    const newAnnouncement = new Announcement({
      announFor,
      title,
      description,
      file,
      uploadedBy,
      role,
    });

    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: "Failed to create announcement" });
  }
};

// Get All Announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().populate("uploadedBy");
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
};

exports.getAnnouncementByUploadedBy = async (req, res) => {
  try {
    const { userId } = req.params; // Extract the userId from the request parameters
    const announcements = await Announcement.find({
      uploadedBy: userId,
    }).populate("uploadedBy");
    if (!announcements.length) {
      return res
        .status(404)
        .json({ error: "No announcements found for this user" });
    }
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
};
// Get Single Announcement
// Get Announcements by Status and Role
exports.getAnnouncementByStatus = async (req, res) => {
  console.log("Inside Get Announcementssssssssssssssssssssss");
  console.log("Inside Get Announcementssssssssssssssssssssss");
  console.log("Inside Get Announcementssssssssssssssssssssss");
  console.log("Inside Get Announcementssssssssssssssssssssss");
  try {
    const { role, status, supervisorId } = req.query; // Extract role, status, and supervisorId from the query parameters

    console.log("Role:", role);
    console.log("Status:", status);
    console.log("Supervisor ID:", supervisorId);

    let query = { $or: [] };

    if (role === "Student") {
      if (supervisorId) {
        // Also include announcements uploaded by the student's supervisor
        query.$or.push({
          uploadedBy: supervisorId,
          announFor: { $in: ["all", "all_fyp_groups", status] }, // Match announFor with 'all', 'all_fyp_groups', or specified 'status'
        });
      }

      query.$or.push({
        uploadedBy: { $ne: supervisorId }, // Exclude announcements by the student's supervisor
        announFor: { $in: ["all", "all_fyp_groups", status] },
        role: "coordinator", // Ensure uploadedBy is a Coordinator
      });
    } else if (role === "supervisor") {
      // For supervisors, include announcements that match 'all', 'supervisors', or are uploaded by this supervisor
      query.$or.push({
        announFor: { $in: ["all", status] }, // Match announFor with 'all', 'all_fyp_groups', or specified 'status'
      });
    } else {
      // Default condition for other roles (e.g., coordinator)
      query.$or.push({ announFor: status });
    }

    console.log("Query:", JSON.stringify(query, null, 2));

    const announcements = await Announcement.find(query).populate("uploadedBy");
    console.log("Announcements:", announcements);

    if (!announcements.length) {
      return res.status(404).json({ error: "No announcements found" });
    }

    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
};

// Update Announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { announFor, title, description } = req.body;
    const { announId } = req.params;

    const file = req.file ? req.file.path : null; // Get the new file path if uploaded
    console.log("AnnounFor", announFor);
    console.log("Title", title);
    console.log("Description", description);
    console.log("File", file);
    console.log("AnnounId", announId);

    const updateFields = {
      announFor,
      title,
      description,
      createdAt: Date.now(),
    };

    console.log("UpdatedFieldsssss", updateFields);

    if (file) {
      updateFields.file = file; // Update the file only if a new file is uploaded
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.announId,
      updateFields,
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.status(200).json(updatedAnnouncement);
  } catch (error) {
    res.status(500).json({ error: "Failed to update announcement" });
  }
};

// Delete Announcement
exports.deleteAnnouncement = async (req, res) => {
  console.log("Delete Announcement Cont Called");
  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(
      req.params.id
    );
    if (!deletedAnnouncement) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete announcement" });
  }
};

exports.deleteAnnouncementAfterExpiry = async (announcementId) => {
  try {
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      console.log("Announcement not found");
      return;
    }

    const expirationDate = new Date(announcement.createdAt);
    expirationDate.setHours(expirationDate.getHours() + 10);

    schedule.scheduleJob(expirationDate, async () => {
      try {
        await Announcement.findByIdAndDelete(announcementId);
        console.log(
          `Announcement with ID: ${announcementId} deleted after expiry`
        );
      } catch (error) {
        console.error(
          `Failed to delete announcement with ID: ${announcementId}`,
          error
        );
      }
    });
  } catch (error) {
    console.error("Error in scheduling announcement deletion", error);
  }
};
