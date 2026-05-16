const mongoose = require("mongoose");

// Define the timetable schema
const timetableSchema = new mongoose.Schema({
  Monday: [
    {
      slot: String,
      class: String,
    },
  ],
  Tuesday: [
    {
      slot: String,
      class: String,
    },
  ],
  Wednesday: [
    {
      slot: String,
      class: String,
    },
  ],
  Thursday: [
    {
      slot: String,
      class: String,
    },
  ],
  Friday: [
    {
      slot: String,
      class: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenUser",
    required: true,
  },
});

// Create a model from the schema
// const Timetable = mongoose.model('Timetable', timetableSchema);
module.exports = mongoose.model("Timetable", timetableSchema);
