const schedule = require("node-schedule");
const FYPRegistrationDead = require("../../models/CoordinatorModels/CreateFYPRegModel");
const mongoose = require("mongoose");
const moment = require("moment");

// Function to schedule job based on registration dueDate and dueTime
// const scheduleJobForRegistration = (dueDateTime, registrationId) => {
//   const now = new Date();
//   const delay = dueDateTime - now;

//   if (delay <= 0) {
//     console.log(
//       `Due time already passed for registration ${registrationId}. Deleting immediately.`
//     );
//     FYPRegistration.findByIdAndDelete(registrationId)
//       .then(() => console.log("Expired FYP registration deleted successfully"))
//       .catch((error) =>
//         console.error("Error deleting expired FYP registration:", error)
//       );
//     return;
//   }

//   console.log(
//     `Scheduling job for registration ${registrationId} to run in ${delay} ms`
//   );

//   setTimeout(async () => {
//     try {
//       console.log(`Executing scheduled job for registration ${registrationId}`);
//       await FYPRegistration.findByIdAndDelete(registrationId);
//       console.log("Expired FYP registration deleted successfully");
//     } catch (error) {
//       console.error("Error deleting expired FYP registration:", error);
//     }
//   }, delay);
// };

const createFYPRegistration = async (req, res) => {
  try {
    const { term, announcementTitle, dueDate, dueTime, instructions } =
      req.body;

    console.log("Term:", term);
    console.log("Announcement Title:", announcementTitle);
    console.log("Due Date:", dueDate);
    console.log("Due Time:", dueTime);
    console.log("Instructions:", instructions);

    // Check if an FYP registration already exists for the given term
    const existingRegistration = await FYPRegistrationDead.findOne({ term });

    if (existingRegistration) {
      console.log(`Existing registration found for term ${term}, rejecting duplicate creation.`);
      return res.status(400).json({ error: "A registration deadline for this term has already been created. You cannot create multiple registrations for the same term." });
    }

    let hours, minutes, period;

    if (dueTime.includes(" ")) {
      // Parse the time string into hours and minutes
      const [time, ampm] = dueTime.split(" ");
      [hours, minutes] = time.split(":");
      period = ampm.toUpperCase();
    } else {
      // Handle 24-hour time format and convert to 12-hour format
      [hours, minutes] = dueTime.split(":");
      hours = parseInt(hours, 10);
      if (hours >= 12) {
        period = "PM";
        hours = hours > 12 ? hours - 12 : hours;
      } else {
        period = "AM";
        hours = hours === 0 ? 12 : hours;
      }
      hours = hours.toString().padStart(2, "0");
    }

    const formattedDueTime = `${hours.toString().padStart(2, "0")}:${minutes} ${period}`;
    console.log("Formatted Due Time:", formattedDueTime);

    // Combine dueDate and 24-hour time into dueDateTime for ISO string
    let hours24 = parseInt(hours, 10);
    if (period === "PM" && hours24 < 12) hours24 += 12;
    if (period === "AM" && hours24 === 12) hours24 = 0;

    const dueDateTimeString = `${dueDate}T${hours24.toString().padStart(2, "0")}:${minutes}:00Z`;
    console.log("Combined Date-Time String (24h):", dueDateTimeString);

    const dueDateTime = new Date(dueDateTimeString);

    if (isNaN(dueDateTime)) {
      throw new Error(
        `Invalid Date created from dueDateTimeString: ${dueDateTimeString}`
      );
    }

    console.log("Due Date Time:", dueDateTime); // Log the parsed dueDateTime

    // Create a new FYP registration document
    const fypRegistration = new FYPRegistrationDead({
      term,
      announcementTitle,
      dueDate,
      dueTime: formattedDueTime,
      instructions,
      dueDateTime,
    });

    // Save the FYP registration document to the database
    await fypRegistration.save();

    // Schedule job for the newly created FYP registration
    // scheduleJobForRegistration(dueDateTime, fypRegistration._id);

    res.status(201).json({
      message: "FYP registration created successfully",
      fypRegistration,
    });
  } catch (error) {
    console.error("Error creating FYP registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Background job for deleting expired registrations
// const deleteExpiredRegistrations = async () => {
//   try {
//     const currentDate = new Date();
//     console.log("Current Date and Time:", currentDate);

//     // Retrieve all registrations to log them
//     const allRegistrations = await FYPRegistrationDead.find({});
//     console.log("All Registrations:", allRegistrations);

//     // Find registrations with dueDateTime less than the current date
//     const expiredRegistrations = await FYPRegistrationDead.find({
//       dueDateTime: { $lt: currentDate },
//     });

//     console.log("Expired Registrations:", expiredRegistrations);
//     console.log(
//       "Number of Expired Registrations:",
//       expiredRegistrations.length
//     );

//     // Delete each expired registration
//     for (const registration of expiredRegistrations) {
//       console.log("Registration Due Date and Time:", registration.dueDateTime);
//       await FYPRegistrationDead.findByIdAndDelete(registration._id);
//       console.log(
//         `Expired FYP registration ${registration._id} deleted successfully.`
//       );
//     }
//   } catch (error) {
//     console.error("Error deleting expired FYP registrations:", error);
//   }
// };

// Schedule the background task to run every minute
// setInterval(deleteExpiredRegistrations, 60000); // 60000 ms = 1 minute

const updateFYPRegDeadline = async (req, res) => {
  const registrationId = req.params.registrationId; // Assuming registrationId is obtained from route params

  const {
    term: newTerm,
    announcementTitle: newAnnouncementTitle,
    dueDate: newDueDate,
    dueTime: newDueTime,
    instructions: newInstructions,
  } = req.body;

  try {
    const updatedRegistration = await FYPRegistrationDead.findByIdAndUpdate(
      registrationId,
      {
        term: newTerm,
        announcementTitle: newAnnouncementTitle,
        dueDate: newDueDate,
        dueTime: newDueTime,
        instructions: newInstructions,
      },
      { new: true }
    );

    if (!updatedRegistration) {
      return res.status(404).json({ message: "FYP registration not found" });
    }

    // If the dueDate or dueTime was updated, recalculate the dueDateTime
    if (newDueDate || newDueTime) {
      const { dueDate, dueTime } = updatedRegistration;
      const [hours, minutes] = newDueTime.split(":");
      const dueDateTime = new Date(`${newDueDate}T${hours}:${minutes}:00Z`);
      updatedRegistration.dueDateTime = dueDateTime;
      await updatedRegistration.save();
    }

    res.status(200).json({
      message: "FYP registration updated successfully",
      updatedRegistration,
    });
  } catch (error) {
    console.error("Error updating FYP registration:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRegistrationDeadline = async (req, res) => {
  const { term } = req.params;
  console.log("GetRegistrationDeadline called with term:", term);

  try {
    const registration = await FYPRegistrationDead.findOne({ term });
    console.log("Registration lookup result:", registration ? "FOUND" : "NOT FOUND");

    if (!registration) {
      return res.status(404).json({ message: "FYP registration not found" });
    }

    res.status(200).json({
      message: "FYP registration found",
      registration,
    });
  } catch (error) {
    console.error("Error fetching FYP registration:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllRegistrationsDeadline = async (req, res) => {
  console.log("Get all Registration Deadline Func Called");
  try {
    const registration = await FYPRegistrationDead.find().populate("term");

    if (!registration) {
      return res.status(404).json({ message: "FYP registration not found" });
    }

    res.status(200).json({
      message: "FYP registration found",
      registration,
    });
  } catch (error) {
    console.error("Error fetching FYP registration:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteFYPRegistration = async (req, res) => {
  console.log("Inside Delete FYP Registration");
  const registrationId = req.params.registrationId; // Assuming registrationId is obtained from route params
  console.log("Registration ID", registrationId);

  try {
    const deletedRegistration = await FYPRegistrationDead.findByIdAndDelete(
      registrationId
    );

    if (!deletedRegistration) {
      return res.status(404).json({ message: "FYP registration not found" });
    }

    // Cancel the scheduled job for this registration
    const scheduledJob = schedule.scheduledJobs[registrationId];
    if (scheduledJob) {
      scheduledJob.cancel();
    }

    res.status(200).json({
      message: "FYP registration deleted successfully",
      deletedRegistration,
    });
  } catch (error) {
    console.error("Error deleting FYP registration:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const deleteExpiredRegistrations = async () => {
//   try {
//     const currentDate = new Date();
//     console.log("Current Date and Time:", currentDate);

//     // Retrieve all registrations with dueDateTime less than the current date
//     const expiredRegistrations = await FYPRegistrationDead.find({
//       dueDateTime: { $lt: currentDate },
//     });

//     console.log("Expired Registrations:", expiredRegistrations);
//     console.log(
//       "Number of Expired Registrations:",
//       expiredRegistrations.length
//     );

//     // Delete each expired registration
//     for (const registration of expiredRegistrations) {
//       console.log("Registration Due Date and Time:", registration.dueDateTime);
//       await FYPRegistrationDead.findByIdAndDelete(registration._id);
//       console.log(
//         `Expired FYP registration ${registration._id} deleted successfully.`
//       );
//     }
//   } catch (error) {
//     console.error("Error deleting expired FYP registrations:", error);
//   }
// };

// // setInterval(deleteExpiredRegistrations, 60000);

// const checkForRegistrationsAndDeleteExpired = async () => {
//   try {
//     const registrationsCount = await FYPRegistrationDead.countDocuments();
//     if (registrationsCount > 0) {
//       await deleteExpiredRegistrations();
//     } else {
//       console.log("No FYP registrations found in the database.");
//     }
//   } catch (error) {
//     console.error("Error checking for FYP registrations:", error);
//   }
// };

// setInterval(checkForRegistrationsAndDeleteExpired, 60000);

module.exports = {
  createFYPRegistration,
  updateFYPRegDeadline,
  deleteFYPRegistration,
  getRegistrationDeadline,
  getAllRegistrationsDeadline,
};
