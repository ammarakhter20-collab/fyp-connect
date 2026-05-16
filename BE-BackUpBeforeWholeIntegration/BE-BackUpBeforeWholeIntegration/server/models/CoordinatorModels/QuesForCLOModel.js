const mongoose = require("mongoose");

const QuestionsForCLOSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  question: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
    min: 0,
  },
});

const QuestionsForCLO = mongoose.model(
  "QuestionsForCLO",
  QuestionsForCLOSchema
);

module.exports = QuestionsForCLO;
