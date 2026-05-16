const mongoose = require("mongoose");

const ManageCLOSchema = new mongoose.Schema({
  CLOCode: {
    type: String,
    required: true,
    unique: true,
  },
  Title: {
    type: String,
    required: true,
  },
  Program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
    required: true,
  },
  Questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionsForCLO",
    },
  ],
});

const ManageCLO = mongoose.model("ManageCLO", ManageCLOSchema);

module.exports = ManageCLO;
