const Timetable = require("../../models/StudentModels/StdTimetableModel");
// const mongoose = require("mongoose");
// const User = require("../models/GenUserModel");

const storeTimetableData = async (req, res) => {
  console.log("Inside store timetable data");
  try {
    const { timetableData, user } = req.body;
    console.log("Checking id", user);
    console.log("Timetable data", timetableData);

    // Create a new instance of the Timetable model
    const newTimetable = new Timetable({
      user,
      Monday: timetableData.Monday,
      Tuesday: timetableData.Tuesday,
      Wednesday: timetableData.Wednesday,
      Thursday: timetableData.Thursday,
      Friday: timetableData.Friday,
    });

    // Save the new timetable document to the database
    await newTimetable.save();

    // Respond with a success message
    res.status(201).json({ message: "Timetable data stored successfully" });
  } catch (error) {
    // If an error occurs, respond with an error message
    res
      .status(500)
      .json({ error: "An error occurred while storing timetable data" });
  }
};

const updateTimetableData = async (req, res) => {
  console.log("Inside update timetable data");
  console.log("Inside update timetable data");
  console.log("Inside update timetable data");
  console.log("Inside update timetable data");
  console.log("Inside update timetable data");
  console.log("Inside update timetable data");
  try {
    const { timetableData, user } = req.body;
    console.log("Checking id", user);
    console.log("Timetable data", timetableData);

    // Find the existing timetable document based on the user ID
    const existingTimetable = await Timetable.findOne({ user: user });

    // If the timetable document does not exist, respond with an error message
    if (!existingTimetable) {
      return res
        .status(404)
        .json({ error: "Timetable data not found for the user" });
    }

    // Update the timetable data fields
    existingTimetable.Monday = timetableData.Monday;
    existingTimetable.Tuesday = timetableData.Tuesday;
    existingTimetable.Wednesday = timetableData.Wednesday;
    existingTimetable.Thursday = timetableData.Thursday;
    existingTimetable.Friday = timetableData.Friday;

    // Save the updated timetable document to the database
    await existingTimetable.save();

    // Respond with a success message
    res.status(200).json({ message: "Timetable data updated successfully" });
  } catch (error) {
    // If an error occurs, respond with an error message
    console.error("Error updating timetable data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating timetable data" });
  }
};

const getTimetableData = async (req, res) => {
  console.log("Inside getTimetableData");
  console.log("Inside getTimetableData");
  console.log("Inside getTimetableData");
  try {
    // Retrieve the user ID from the request parameters
    const userId = req.query.userId;
    console.log("Fetching timetable data for user:", userId);

    // Find the timetable document associated with the user ID
    const timetable = await Timetable.find({ user: userId }).populate({
      path: "user",
      model: "GenUser",
    });

    // Check if timetable data exists
    if (!timetable) {
      return res.status(404).json({ error: "Timetable data not found" });
    }

    // Respond with the timetable data
    res.status(200).json({ timetableData: timetable });
  } catch (error) {
    // If an error occurs, respond with an error message
    console.error("Error fetching timetable data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching timetable data" });
  }
};

const storeSupTimetableData = async (req, res) => {
  console.log("Inside store timetable data");
  try {
    const { timetableData, user } = req.body;
    console.log("Checking id", user);
    console.log("Timetable data", timetableData);

    // Create a new instance of the Timetable model
    const newTimetable = new Timetable({
      user,
      Monday: timetableData.Monday,
      Tuesday: timetableData.Tuesday,
      Wednesday: timetableData.Wednesday,
      Thursday: timetableData.Thursday,
      Friday: timetableData.Friday,
    });

    // Save the new timetable document to the database
    await newTimetable.save();

    // Respond with a success message
    res.status(201).json({ message: "Timetable data stored successfully" });
  } catch (error) {
    // If an error occurs, respond with an error message
    res
      .status(500)
      .json({ error: "An error occurred while storing timetable data" });
  }
};

module.exports = {
  storeTimetableData,
  getTimetableData,
  updateTimetableData,
};
