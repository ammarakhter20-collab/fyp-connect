const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CLOForExamSchema = new Schema({
  shortCode: {
    type: String,
    required: true,
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program", // Assuming the model name for PanelDetails is 'PanelDetails'
    required: true,
  },
  // selectExam: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "ExamType", // Assuming the model name for PanelDetails is 'PanelDetails'
  //   required: true,
  // },
  CLOs: [
    {
      type: Schema.Types.ObjectId,
      ref: "ManageCLO", // Assuming the model name for CLO is 'CLO'
    },
  ],
});

const CLOForExam = mongoose.model("CLOForExam", CLOForExamSchema);

module.exports = CLOForExam;
