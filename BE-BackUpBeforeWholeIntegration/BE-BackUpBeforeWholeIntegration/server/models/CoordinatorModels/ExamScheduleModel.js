const mongoose = require("mongoose");

const createExamScheduleSchema = new mongoose.Schema({
  panel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PanelDetails", // Assuming the model name for PanelDetails is 'PanelDetails'
    required: true,
  },
  ExamDate: {
    type: Date,
    required: true,
  },
  ExamTime: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Regular expression to match time format like '10:00AM', '2:30PM', '03:42 AM', '3:42 AM'
        return /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid time format (e.g., 10:00AM)`,
    },
  },
  Venue: {
    type: String,
    required: true,
  },
  CreatedExam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CreateExamModel", // Reference to the CreateExamModel
    required: true,
  },
});

const CreateExamSchedule = mongoose.model(
  "CreateExamSchedule",
  createExamScheduleSchema
);

module.exports = CreateExamSchedule;
